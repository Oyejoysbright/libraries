
export const getClassNames = (...classNames: string[]) => classNames.join(' ');
export const getStoryTitle = (storyName: string) => "React Components/"+storyName;
/**
 * It returns the abbreviation of a name. e.g Peter Akinlolu will be PA.
 * @param name The name or string to be worked.
 * @returns string
 */
export const getNameAbbreviation = (name?: string) => {
    if (name) {
      const firstLastName = name.trim().split(" ");
  
      if (firstLastName.length >= 2) {
        return firstLastName[0][0] + firstLastName[1][0];
      }
  
      return firstLastName[0][0] + firstLastName[0][1];
    }
  
    return "**";
  };