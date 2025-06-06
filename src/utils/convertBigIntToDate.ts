export function convertBigIntToDate(
  bigintTime: bigint | string | number
): Date {
  try {
    // Handle different input types
    let timeValue: bigint;

    if (typeof bigintTime === "string") {
      // Handle string representation of BigInt
      timeValue = BigInt(bigintTime);
    } else if (typeof bigintTime === "number") {
      // Handle regular number (convert to BigInt)
      timeValue = BigInt(bigintTime);
    } else {
      // Already a BigInt
      timeValue = bigintTime;
    }

    // Debug logging to understand your backend format
    if (process.env.NODE_ENV === "development") {
      console.log("Converting time:", {
        input: bigintTime,
        type: typeof bigintTime,
        bigintValue: timeValue.toString(),
        length: timeValue.toString().length,
      });
    }

    const timeStr = timeValue.toString();

    // Your timestamp: 1749191399309580586 (19 digits = nanoseconds)
    // Convert nanoseconds to milliseconds by dividing by 1,000,000
    if (timeStr.length >= 16) {
      // Use BigInt division to avoid precision loss
      const milliseconds = Number(timeValue / BigInt(1000000));
      const date = new Date(milliseconds);

      if (process.env.NODE_ENV === "development") {
        console.log("Nanoseconds conversion:", {
          nanoseconds: timeStr,
          milliseconds,
          date: date.toISOString(),
          isValid: !isNaN(date.getTime()),
          year: date.getFullYear(),
        });
      }

      // Validate the resulting date is reasonable
      if (
        !isNaN(date.getTime()) &&
        date.getFullYear() >= 1970 &&
        date.getFullYear() <= 2100
      ) {
        return date;
      } else {
        console.error("Invalid date after nanoseconds conversion:", {
          milliseconds,
          date: date.toISOString(),
          year: date.getFullYear(),
        });
      }
    }

    // Handle milliseconds (13 digits)
    if (timeStr.length >= 10 && timeStr.length <= 13) {
      const milliseconds = Number(timeValue);
      const date = new Date(milliseconds);

      if (process.env.NODE_ENV === "development") {
        console.log("Milliseconds conversion:", {
          milliseconds,
          date: date.toISOString(),
          isValid: !isNaN(date.getTime()),
        });
      }

      if (
        !isNaN(date.getTime()) &&
        date.getFullYear() >= 1970 &&
        date.getFullYear() <= 2100
      ) {
        return date;
      }
    }

    // Handle seconds (10 digits or less)
    if (timeStr.length <= 10) {
      const milliseconds = Number(timeValue) * 1000;
      const date = new Date(milliseconds);

      if (process.env.NODE_ENV === "development") {
        console.log("Seconds conversion:", {
          seconds: Number(timeValue),
          milliseconds,
          date: date.toISOString(),
          isValid: !isNaN(date.getTime()),
        });
      }

      if (
        !isNaN(date.getTime()) &&
        date.getFullYear() >= 1970 &&
        date.getFullYear() <= 2100
      ) {
        return date;
      }
    }

    // If all conversions fail, log the issue and return current date
    console.error("Could not convert timestamp to valid date:", {
      input: bigintTime,
      timeStr,
      length: timeStr.length,
    });

    return new Date();
  } catch (error) {
    console.error(
      "Error converting BigInt to Date:",
      error,
      "Input:",
      bigintTime
    );
    return new Date();
  }
}
