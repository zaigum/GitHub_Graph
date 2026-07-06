import { simpleGit } from "simple-git";
import { writeFile } from "jsonfile";
import moment from "moment";
import random from "random";

const FILE_PATH = "./data.json";

// Initialize simple-git for your repo
const git = simpleGit(process.cwd());

const makeCommit = async (n) => {
  if (n === 0) {
    try {
      await git.push("origin", "main");
      console.log("All changes pushed to remote repository");
    } catch (err) {
      console.error("Error pushing to remote:", err);
    }
    return;
  }

  const x = random.int(0, 51); // weeks within past year
  const y = random.int(0, 6);  // days
  const DATE = moment()
    .subtract(1, "y")
    .add(x, "w")
    .add(y, "d");

  // Skip future dates
  if (DATE.isAfter(moment())) {
    return makeCommit(n);
  }

  const DATE_STR = DATE.format();

  const data = { date: DATE_STR };
  console.log("Committing for date:", DATE_STR);

  try {
    await writeFile(FILE_PATH, data);

    await git.add([FILE_PATH]);
    await git.env({
      GIT_AUTHOR_DATE: DATE_STR,
      GIT_COMMITTER_DATE: DATE_STR,
    }).commit(DATE_STR, { "--date": DATE_STR });

    console.log(`Committed: ${DATE_STR}`);
    await makeCommit(n - 1);
  } catch (err) {
    console.error("Error during commit process:", err);
  }
};

// Start committing
makeCommit(120);
