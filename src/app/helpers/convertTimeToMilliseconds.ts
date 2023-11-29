export const convertTimeToMilliseconds = (time: string): number => {
  if (time.length === 0) return 0;

  const posOfColon = time.indexOf(':');
  let hours: number = parseInt(time.substring(0, posOfColon));
  hours -= 1; //Adjusted for west african time zone

  const minutes: number = parseInt(
    time.substring(posOfColon + 1, posOfColon + 3)
  );

  const timeRef: string = time.substring(posOfColon + 3).trim();

  if (timeRef == 'PM') {
    hours += 12;
  }

  return (hours * 60 * 60 + minutes * 60) * 1000;
};
