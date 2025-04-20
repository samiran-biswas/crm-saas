import {
  FETCH_DASHBOARD_STATS_REQUEST,
  FETCH_DASHBOARD_STATS_SUCCESS,
  FETCH_DASHBOARD_STATS_FAILURE,
  FETCH_ACTIVITIES_REQUEST,
  FETCH_ACTIVITIES_SUCCESS,
  FETCH_ACTIVITIES_FAILURE
} from '../types/dashboardTypes';

const initialState = {
  stats: {
    totalLeads: 0,
    totalCustomers: 0,
    openTickets: 0,
    monthlyRevenue: 0
  },
  activities: [],
  loading: false,
  error: null
};

const dashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_DASHBOARD_STATS_REQUEST:
    case FETCH_ACTIVITIES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case FETCH_DASHBOARD_STATS_SUCCESS:
      return {
        ...state,
        loading: false,
        stats: action.payload,
        error: null
      };

    case FETCH_ACTIVITIES_SUCCESS:
      return {
        ...state,
        loading: false,
        activities: action.payload,
        error: null
      };

    case FETCH_DASHBOARD_STATS_FAILURE:
    case FETCH_ACTIVITIES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    default:
      return state;
  }
};

export default dashboardReducer; 