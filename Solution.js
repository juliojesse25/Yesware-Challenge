const readTextFile = require("read-text-file");

class Solution {
  constructor(fileLocation) {
    this.contents = readTextFile.readSync(fileLocation);
    this.fullNames = { _count: 0, data: {} };
    this.firstNames = { _count: 0, data: {} };
    this.lastNames = { _count: 0, data: {} };
    this.uniqueNames = [];
    this.init();
  }
  get output() {
    const { fullNames, firstNames, lastNames } = this;
    const uniqueNames = this.uniqueNames.slice(0, 25);
    const topTenLastNames = Object.values(this.lastNames.data)
      .sort((a, b) => b._count - a._count)
      .slice(0, 10);
    const topTenFirstNames = Object.values(this.firstNames.data)
      .sort((a, b) => b._count - a._count)
      .slice(0, 10);
    const splitNames = uniqueNames.map(name => {
      const [last, first] = name.split(", ");
      return [last, first];
    });
    
    const modifiedNames = splitNames.map((name, index) => {
      // first name is the first name of the name at the next index if there is a next index
      name[1] = splitNames[index + 1] ? splitNames[index + 1][1] : uniqueNames[0].split(',')[1];
      return name.join(", ");
    });
    return {
      countFullNames: fullNames._count,
      countLastNames: lastNames._count,
      countFirstNames: firstNames._count,
      topTenFirstNames,
      topTenLastNames,
      uniqueNames,
      modifiedNames
    };
  }
  init() {
    const lines = this.contents.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const nextLine = lines[i];
      const isUnique = {
        isFullNameUnique: true,
        isLastNameUnique: true,
        isFirstNameUnique: true
      };
      let fullName;
      if (nextLine.includes(" -- ")) {
        // full name
        fullName = nextLine.split(" -- ")[0];
      } else {
        // if line doesnt include " -- ", skip to next line
        continue;
      }
      // only allow lowercase/uppercase letters
      // allow single quote in name => /^[a-zA-Z,\' ]+$/ to include names like O'conner
      const regex = /^[a-zA-Z, ]+$/;
      if (!regex.test(fullName)) {
        // if line doesn't pass regex validation, skip to next line
        continue;
      }
      const [lastName, firstName] = fullName.split(", ");
      const processNames = (object, key, uniqueTracker, uniqueKey) => {
        // if key in object already exists, increment counters and the key is not unique
        // if not, create the object
        if (object.data[key]) {
          object.data[key]._count++;
          uniqueTracker[uniqueKey] = false;
        } else {
          object._count++;
          object.data[key] = {
            data: key,
            _count: 1
          };
        }
      };
      processNames(this.fullNames, fullName, isUnique, "isFullNameUnique");
      processNames(this.lastNames, lastName, isUnique, "isLastNameUnique");
      processNames(this.firstNames, firstName, isUnique, "isFirstNameUnique");
      if (isUnique.isFirstNameUnique && isUnique.isLastNameUnique) {
        // if both lastName and firstName have not been seen before
        // the full name is unique; add to uniqueNames
        this.uniqueNames.push(fullName);
      }
    }
  }
}
function main() {
  const file = new Solution("./yesware-test-data.txt");
  console.log(file.output);
}
main();
