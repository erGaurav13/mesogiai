export const getMockCoordinates = (location) => {
  // Simple hash-based mock coordinates
  const hash = location.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
  return {
    latitude: (hash % 180) - 90,  // -90 to 90
    longitude: (hash % 360) - 180 // -180 to 180
  };
};