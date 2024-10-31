// Base URL for the Storypath RESTful API
const API_BASE_URL = 'https://0b5ff8b0.uqcloud.net/api';

// JWT token for authorization, replace with your actual token from My Grades in Blackboard
const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic3R1ZGVudCIsInVzZXJuYW1lIjoiczQ5MDE3MjQifQ.eUCo6iI8iGEU_pAJMilH4GdgGmT_AsYpf6FZO0EOhBw';

// Your UQ student username, used for row-level security to retrieve your records
const USERNAME = 's4901724';

/**
 * Helper function to handle API requests.
 * Sets the authorization token and optionally includes the request body.
 *
 * @param {string} endpoint - The API endpoint to call.
 * @param {string} [method='GET'] - The HTTP method to use (GET, POST, PATCH, DELETE).
 * @param {object} [body=null] - The request body to send, typically for POST or PATCH requests.
 * @returns {Promise<object>} - The JSON response from the API.
 * @throws {Error} If the HTTP response status is not OK (>=400).
 */
export async function apiRequest(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${JWT_TOKEN}`
    },
  };

  // Set "Prefer" header for POST and PATCH requests to return full representations.
  if (method === 'POST' || method === 'PATCH') {
    options.headers['Prefer'] = 'return=representation';
  }

  // Include request body and add username for row-level security.
  if (body) {
    options.body = JSON.stringify({ ...body, username: USERNAME });
  }

  // Send the request to the API and check for success.
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

  // Handle non-OK responses.
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // Return null for successful DELETE operations, else return JSON response.
  if (response.status === 204 && method === 'DELETE') {
    return null;
  } else {
    return response.json();
  }
}

/**
 * Creates a new project in the database.
 * 
 * @param {object} project - The project data to be inserted.
 * @returns {Promise<object>} - The created project object returned by the API.
 */
export async function createProject(project) {
  return apiRequest('/project', 'POST', project);
}

/**
 * Retrieves a list of all projects associated with the current user.
 * 
 * @returns {Promise<Array>} - An array of project objects.
 */
export async function getProjects() {
  return apiRequest('/project');
}

/**
 * Retrieves a single project by its ID.
 * 
 * @param {string} id - The ID of the project to retrieve.
 * @returns {Promise<object>} - The project object matching the provided ID.
 */
export async function getProject(id) {
  return apiRequest(`/project?id=eq.${id}`);
}

/**
 * Deletes a project by its ID.
 * 
 * @param {string} id - The ID of the project to delete.
 * @returns {Promise<object|null>} - The deleted project object or null if successful.
 */
export async function deleteProject(id) {
  return apiRequest(`/project?id=eq.${id}`, 'DELETE');
}

/**
 * Updates an existing project by its ID.
 * 
 * @param {string} id - The ID of the project to update.
 * @param {object} updatedProjectData - The updated project data.
 * @returns {Promise<object>} - The updated project object.
 */
export async function updateProject(id, updatedProjectData) {
  return apiRequest(`/project?id=eq.${id}`, 'PATCH', updatedProjectData);
}

/**
 * Retrieves all locations associated with a specified project.
 * 
 * @param {string} projectId - The ID of the project to get locations for.
 * @returns {Promise<Array>} - An array of location objects.
 */
export async function getLocations(projectId) {
  return apiRequest(`/location?project_id=eq.${projectId}`);
}

/**
 * Creates a new location associated with a specified project.
 * 
 * @param {object} location - The location data to be inserted.
 * @returns {Promise<object>} - The created location object returned by the API.
 */
export async function createLocation(location) {
  return apiRequest('/location', 'POST', location);
}

/**
 * Deletes a location by its ID.
 * 
 * @param {string} id - The ID of the location to delete.
 * @returns {Promise<null>} - Null upon successful deletion.
 */
export async function deleteLocation(id) {
  return apiRequest(`/location?id=eq.${id}`, 'DELETE');
}

/**
 * Deletes all locations associated with a specific project.
 * 
 * @param {string} projectId - The ID of the project whose locations should be deleted.
 * @returns {Promise<null>} - Null upon successful deletion.
 */
export async function deleteAllLocations(projectId) {
  return apiRequest(`/${projectId}/locations`, 'DELETE');
}

/**
 * Updates an existing location by its ID.
 * 
 * @param {string} id - The ID of the location to update.
 * @param {object} updatedLocationData - The updated location data.
 * @returns {Promise<object>} - The updated location object.
 */
export async function updateLocation(id, updatedLocationData) {
  return apiRequest(`/location?id=eq.${id}`, 'PATCH', updatedLocationData);
}

/**
 * Adds a new scanned location to the tracking table.
 * 
 * @param {object} scanData - The scan data to be inserted (project_id, location_id, username).
 * @returns {Promise<object>} - The created tracking object returned by the API.
 */
export async function addScannedLocation(scanData) {
  return apiRequest('/tracking', 'POST', scanData);
}

/**
 * Retrieves a specific location by its ID.
 * 
 * @param {string} locationId - The ID of the location to retrieve.
 * @returns {Promise<object>} - The location object matching the provided ID.
 */
export async function getLocation(locationId) {
  return apiRequest(`/location?id=eq.${locationId}`);
}

/**
 * Adds tracking data for a scanned location.
 * 
 * @param {object} trackingData - The tracking data to add.
 * @returns {Promise<object>} - The created tracking object returned by the API.
 */
export async function addTracking(trackingData) {
  return apiRequest('/tracking', 'POST', trackingData);
}

/**
 * Retrieves scanned locations for a specified project and user.
 * 
 * @param {string} projectId - The ID of the project.
 * @returns {Promise<Array>} - An array of scanned location objects.
 */
export async function getScannedLocations(projectId, user) {
  return apiRequest(`/tracking?project_id=eq.${projectId}&username=eq.${USERNAME}&participant_username=eq.${user}`);
}

/**
 * Deletes scanned locations for the current user in a specified project.
 * 
 * @param {string} projectId - The ID of the project.
 * @returns {Promise<null>} - Returns null upon successful deletion.
 */
export async function deleteScannedLocations(projectId, participantUsername) {
  return apiRequest(`/tracking?project_id=eq.${projectId}&username=eq.${USERNAME}`, 'DELETE');
}