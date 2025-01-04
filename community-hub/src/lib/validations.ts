export const validateUrl = (url: string, type: 'linkedin' | 'github' | 'portfolio' | 'project'): { isValid: boolean; message?: string } => {
  if (!url) return { isValid: true }; // Allow empty URLs except for LinkedIn

  // Basic URL validation
  try {
    new URL(url);
  } catch {
    return { isValid: false, message: 'Please enter a valid URL' };
  }

  // Specific platform validations
  switch (type) {
    case 'linkedin':
      if (!url.toLowerCase().includes('linkedin.com/')) {
        return { isValid: false, message: 'Please enter a valid LinkedIn profile URL' };
      }
      break;
    case 'github':
      if (!url.toLowerCase().includes('github.com/')) {
        return { isValid: false, message: 'Please enter a valid GitHub profile URL' };
      }
      break;
    case 'portfolio':
      // Any valid URL is acceptable for portfolio
      break;
    case 'project':
      // Any valid URL is acceptable for projects
      break;
  }

  return { isValid: true };
};

// Function to check if a skill exists in other levels
export const isSkillInOtherLevels = (
  skill: string,
  currentLevel: 'advanced' | 'intermediate' | 'beginner',
  advancedSkills: string[],
  intermediateSkills: string[],
  beginnerSkills: string[]
): boolean => {
  switch (currentLevel) {
    case 'advanced':
      return intermediateSkills.includes(skill) || beginnerSkills.includes(skill);
    case 'intermediate':
      return advancedSkills.includes(skill) || beginnerSkills.includes(skill);
    case 'beginner':
      return advancedSkills.includes(skill) || intermediateSkills.includes(skill);
    default:
      return false;
  }
};
