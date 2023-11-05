const { execSync, spawn } = require("child_process");
const fs = require("fs");
const { Signale } = require("signale");
const path = require("path");
const Client = require('ssh2').Client;

const logger = new Signale();
let version;
let package;

let packageJSONStr = fs
  .readFileSync(path.join(__dirname, "../package.json"))
  .toString("utf8");

function updateVersion() {
  package = JSON.parse(packageJSONStr);
  version = package.version;
  let versionArr = String(package.version).split(".");

  versionArr[versionArr.length - 1] =
    Number(versionArr[versionArr.length - 1]) + 1;
  package.version = versionArr.join(".");
  fs.writeFileSync(
    path.join(__dirname, "../package.json"),
    JSON.stringify(package, "", 2),
    "utf8"
  );
  console.log(`版本从${version}， 更新至${package.version}`);
  return package.version;
}

updateVersion();

// 解压部署操作
function Shell(conn, name) {
  conn.shell((err,stream)=>{
      stream.end(
          `
           cd /home/html
           mv songs-note back/songs-note.$(date "+%Y%m%d%H%M%")
           tar zxvf ${name}.tar.gz
           mv ${name} songs-note
           rm -rf ${name}.tar.gz
           exit
          `
          //进入服务器暂存地址
          //上传前先备份原始项目
          //解压上传的压缩包
          //移动解压后的文件到发布目录
          //删除压缩包
          //退出
      ).on('data',data=>{
          console.log(data.toString())
      }).on('close',()=>{
          conn.end()
      })
  })
}

function updateFixService(version) {
  let name = `songs-note.${version}`;
  execSync(`tar zcvf ${name}.tar.gz ./public`, {
    stdio: [0, 1, 2],
  });

  const conn = new Client();
  conn.on('ready', () => {
    console.log('Client :: ready');
    conn.sftp((err, sftp)=> {
      
      console.log('SFTP :: Finished');
      sftp.fastPut(`./${name}.tar.gz`, `/home/html/${name}.tar.gz`, {}, function(err) {
        if (err) {
          console.error('Error copying file:', err);
        } else {
          console.log('File transferred successfully!');
          Shell(conn, name);
        }
      });
      
    });
    
  }).connect({
    host: '47.108.140.70',
    port: '22',
    username: 'root',
    password: '96515@ss.com' // you can also use private keys with 'key' path
  });
}

(async () => {
  let version = updateVersion();
  let versionData;
  try {
    execSync(
      `git add . && git commit -m "update version ${version}" && git push origin master`,
      {
        stdio: [0, 1, 2],
      }
    );
    versionData = true;
    logger.info(`git add . && git commit -m "update version ${version}"`);
  } catch (error) {
    logger.error(e.message);
    process.exit(0);
  }
  if (versionData) {
    execSync("npm run release", {
      stdio: [0, 1, 2],
    });
  }
  updateFixService(version);
})();
