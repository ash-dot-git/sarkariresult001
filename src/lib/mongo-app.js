const APP_ID = process.env.MONGODB_APP_ID;
const API_KEY = process.env.MONGODB_API_KEY;
let cachedToken = null;
let tokenExpiry = null;

export async function getAccessToken(apiKey, forceRefresh = false) {
  if (!forceRefresh && cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const res = await fetch(`https://ap-south-1.aws.realm.mongodb.com/api/client/v2.0/app/${APP_ID}/auth/providers/api-key/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key: apiKey }),
  });

  if (!res.ok) {
    const errorBody = await res.json();
    throw new Error(`Failed to authenticate with MongoDB App Services: ${errorBody.error || JSON.stringify(errorBody)}`);
  }

  const data = await res.json();
  cachedToken = data.access_token;
  tokenExpiry = Date.now() + 25 * 60 * 1000; // Cache for 25 mins (token is usually valid for 30 mins)

  return cachedToken;  // this is the JWT you can now use
}


export async function callMongoFunction(functionName, args = {}) {
  let accessToken = await getAccessToken(API_KEY);

  const makeRequest = async (token) => {
    const fetchOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: functionName,
        arguments: [args],
      }),
    };

    if (args.noCache) {
      fetchOptions.cache = 'no-store';
    } else {
      fetchOptions.next = { revalidate: 30 };
    }

    return fetch(`https://ap-south-1.aws.realm.mongodb.com/api/client/v2.0/app/${APP_ID}/functions/call`, fetchOptions);
  };

  let response = await makeRequest(accessToken);

  if (response.status === 401) {
    const errorBody = await response.json();
    if (errorBody.error?.includes('invalid session') || errorBody.error?.includes('access token expired')) {
      console.log('Access token expired, fetching a new one and retrying...');
      accessToken = await getAccessToken(API_KEY, true); // Force refresh
      response = await makeRequest(accessToken); // Retry
    }
  }

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(`Mongo Function '${functionName}' error: ${errorBody.error || response.statusText}`);
  }

  return response.json();
}