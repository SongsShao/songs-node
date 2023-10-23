const { execSync } = require("child_process");
const fs = require("fs");
const { Signale } = require("signale");
const path = require("path");

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

function updateGiteePages() {
  const request = fetch("https://gitee.com/batype/songs-note/pages/rebuild", {
    method: "POST", // 设置请求方法为POST
    headers: {
      "Content-Type": "application/json", // 设置请求头信息
    },
    body: JSON.stringify({
      branch: "gh-pages",
      build_directory: "",
      force_https: true,
      auto_update: false,
    }), // 将要发送的数据转换为JSON字符串
  });

  request
    .then((response) => {
      logger.info(response);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json(); // 解析响应数据为JSON对象
    })
    .then((res) => {
      logger.info("Gitee update Pages request is OK!");
    })
    .catch((err) => {
      logger.error(err.message);
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
    updateGiteePages();
  }
})();
