const { execSync, spawn } = require("child_process");
const fs = require("fs");
const { Signale } = require("signale");
const path = require("path");
const Client = require('ssh2').Client;
const sftp = require('ssh2-sftp-client');


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


function updateFixService() {
  const conn = new Client();
  conn.on('ready', function() {
    console.log('Client :: ready');
    const sftpClient = conn.sftp(function(err) {
      if (err) {
        console.error('Error connecting to SFTP:', err);
        conn.end();
      } else {
        console.log('SFTP :: Finished');
        sftpClient.end(); // Close SFTP connection
      }
    }, sftp => sftp.fastPut('/public', '/home/html', { recursive: true }, function(err) {
      if (err) {
        console.error('Error copying file:', err);
      } else {
        console.log('File transferred successfully!');
      }
    }));
    
  }).connect({
    host: '47.108.140.70',
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
  updateFixService();
})();
