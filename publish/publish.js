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
  execSync("scp -r public/ root@47.108.140.70:/home/html/", {
    stdio: [0, 1, 2],
  });
  execSync("96515@ss.com", {
    stdio: [0, 1, 2],
  });
  execSync("ssh roo");
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
  updateGiteePages();
})();
