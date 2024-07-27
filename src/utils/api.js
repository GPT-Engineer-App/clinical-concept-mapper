import axios from 'axios';

const METAMAP_API_URL = 'https://ii.nlm.nih.gov/metamaplite/rest/annotate';
const API_KEY = 'ea95a1ba-a529-42af-a2d4-468363f4e3f7';

export const extractEntities = async (inputText) => {
  try {
    // Step 1: Call MetaMapLite API
    const metamapResponse = await axios.post(METAMAP_API_URL, 
      `inputtext=${encodeURIComponent(inputText)}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        params: {
          apiKey: API_KEY
        }
      }
    );

    // Step 2: Process MetaMapLite response and extract entities
    const entities = metamapResponse.data.map(entity => ({
      name: entity.evText,
      type: entity.semTypes[0],
      cui: entity.conceptId,
      preferredName: entity.preferredName
    }));

    return entities;
  } catch (error) {
    console.error('Error in extractEntities:', error);
    throw error;
  }
};