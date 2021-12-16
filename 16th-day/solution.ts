const text = await Deno.readTextFile("./input.txt");

let binaryString = "";
for (const char of text.trim()) {
  const number = parseInt(char, 16);
  binaryString += number.toString(2).padStart(4, "0");
}

interface ParsedPackage {
  id: number;
  version: number;
  content?: number;
  subPackages: ParsedPackage[];
  length: number;
}

const parsePackage = (binaryPackage: string): ParsedPackage => {
  let length = 6;
  let content: number | undefined;
  const subPackages: ParsedPackage[] = [];

  const version = parseInt(binaryPackage.substr(0, 3), 2);
  const id = parseInt(binaryPackage.substr(3, 3), 2);

  if (id === 4) {
    let numberString = "";
    let substring = binaryPackage.substring(6);

    while (true) {
      length += 5;
      numberString += substring.substr(1, 4);

      if (substring[0] === "0") {
        break;
      }

      substring = substring.substring(5);
    }

    content = parseInt(numberString, 2);
  } else {
    length++;
    const lengthBit = parseInt(binaryPackage.substr(6, 1), 2);

    if (lengthBit === 0) {
      length += 15;

      let subPackagesLength = parseInt(binaryPackage.substr(7, 15), 2);
      let subPackagesString = binaryPackage.substr(22);

      while (subPackagesLength > 0) {
        const subPackage = parsePackage(subPackagesString);
        subPackages.push(subPackage);

        subPackagesString = subPackagesString.substr(subPackage.length);
        subPackagesLength -= subPackage.length;

        length += subPackage.length;
      }
    }

    if (lengthBit === 1) {
      length += 11;

      let subPackagesCount = parseInt(binaryPackage.substr(7, 11), 2);
      let subPackagesString = binaryPackage.substr(18);

      while (subPackagesCount > 0) {
        const subPackage = parsePackage(subPackagesString);
        subPackages.push(subPackage);

        subPackagesString = subPackagesString.substr(subPackage.length);
        subPackagesCount--;

        length += subPackage.length;
      }
    }
  }

  return {
    version,
    id,
    content,
    subPackages,
    length,
  };
};

const sumVersions = (packageData: ParsedPackage): number => {
  if (packageData.subPackages?.length === 0) {
    return packageData.version;
  }

  return (
    packageData.version +
    packageData.subPackages.reduce(
      (acc, subPackageData) => acc + sumVersions(subPackageData),
      0
    )
  );
};

const calculatePackage = (packageData: ParsedPackage): number => {
  switch (packageData.id) {
    case 0:
      return packageData.subPackages.reduce(
        (acc, subPackage) => acc + calculatePackage(subPackage),
        0
      );

    case 1:
      return packageData.subPackages.reduce(
        (acc, subPackage) => acc * calculatePackage(subPackage),
        1
      );

    case 2:
      return Math.min.apply(
        null,
        packageData.subPackages.map((subPackage) =>
          calculatePackage(subPackage)
        )
      );

    case 3:
      return Math.max.apply(
        null,
        packageData.subPackages.map((subPackage) =>
          calculatePackage(subPackage)
        )
      );

    case 4:
      return packageData.content ?? 0;

    case 5: {
      const [sub1, sub2] = packageData.subPackages;
      return calculatePackage(sub1) > calculatePackage(sub2) ? 1 : 0;
    }

    case 6: {
      const [sub1, sub2] = packageData.subPackages;
      return calculatePackage(sub1) < calculatePackage(sub2) ? 1 : 0;
    }

    case 7: {
      const [sub1, sub2] = packageData.subPackages;
      return calculatePackage(sub1) === calculatePackage(sub2) ? 1 : 0;
    }

    default:
      throw new Error(`Unknown package ID type - ${packageData.id}`);
  }
};

const packageData = parsePackage(binaryString);

// console.log("Package data:");
// console.log(JSON.stringify(packageData, null, 2));

console.log("Sum of versions:");
console.log(sumVersions(packageData));

console.log("Calculated value of package:");
console.log(calculatePackage(packageData));
