import axios from 'axios';

const METAMAP_API_URL = 'https://ii.nlm.nih.gov/metamaplite/rest/annotate';
const UMLS_API_URL = 'https://uts-ws.nlm.nih.gov/rest/search/current';
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
      cui: entity.conceptId
    }));

    // Step 3: Enrich entities with UMLS data
    const enrichedEntities = await Promise.all(entities.map(async (entity) => {
      try {
        const umlsResponse = await axios.get(UMLS_API_URL, {
          params: {
            string: entity.name,
            searchType: 'exact',
            apiKey: API_KEY
          }
        });
        const umlsResult = umlsResponse.data.result.results[0];
        return {
          ...entity,
          preferredName: umlsResult ? umlsResult.name : entity.name
        };
      } catch (error) {
        console.error(`Error fetching UMLS data for entity ${entity.name}:`, error);
        return entity;
      }
    }));

    return enrichedEntities;
  } catch (error) {
    console.error('Error in extractEntities:', error);
    throw error;
  }
};