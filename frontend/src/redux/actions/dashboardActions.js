import axios from 'axios';
import { 
  FETCH_DASHBOARD_STATS_REQUEST,
  FETCH_DASHBOARD_STATS_SUCCESS,
  FETCH_DASHBOARD_STATS_FAILURE,
  FETCH_ACTIVITIES_REQUEST,
  FETCH_ACTIVITIES_SUCCESS,
  FETCH_ACTIVITIES_FAILURE
} from '../types/dashboardTypes';

// Fetch dashboard statistics
export const fetchDashboardStats = () => async (dispatch) => {
  try {
    dispatch({ type: FETCH_DASHBOARD_STATS_REQUEST });

    const response = await axios.get('/api/dashboard/stats');
    
    dispatch({
      type: FETCH_DASHBOARD_STATS_SUCCESS,
      payload: response.data.data
    });
  } catch (error) {
    dispatch({
      type: FETCH_DASHBOARD_STATS_FAILURE,
      payload: error.response?.data?.error || 'Failed to fetch dashboard statistics'
    });
  }
};

// Fetch recent activities
export const fetchActivities = () => async (dispatch) => {
  try {
    dispatch({ type: FETCH_ACTIVITIES_REQUEST });

    const response = await axios.get('/api/dashboard/activities');
    
    dispatch({
      type: FETCH_ACTIVITIES_SUCCESS,
      payload: response.data.data
    });
  } catch (error) {
    dispatch({
      type: FETCH_ACTIVITIES_FAILURE,
      payload: error.response?.data?.error || 'Failed to fetch activities'
    });
  }
}; 