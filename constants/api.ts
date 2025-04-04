export const API_START = '/api/start-workout/startWorkout'
export const API_GET_WORKOUT = '/api/workout/getWorkout'
export const API_UPDATE_SET_TIME = '/api/workout/updateSetTime'
export const API_CREATE_SET = '/api/workout/createSet'

export const API_END = '/api/finish-workout/finishWorkout'
export const API_COPY = '/api/workout/workoutCopy'

const GET_USER_EXERCISES = '/api/exercises/getUserExercises'
const CREATE_USER_EXERCISE = '/api/exercises/createUserExercise'
const DELETE_USER_EXERCISE = '/api/exercises/deleteUserExercise'
const EXERCISES_LIST = '/api/exercises/exercises'

const FINISH_WORKOUT = '/api/finish-workout/finishWorkout'
const START_WORKOUT = '/api/start-workout/startWorkout'
const GET_CHARTS_DATA = '/api/statistics/getChartsData'
const GLOBAL_STATISTICS = '/api/statistics/getGlobalStatistics'

const RESET_WORKOUT = '/api/workout/resetWorkout'
const DELETE_WORKOUT = '/api/workout/workoutDelete'
const CREATE_WORKOUT = '/api/workout/create'
const UPDATE_WORKOUT = '/api/workout/update'
const WORKOUTS_LIST = '/api/workout/workoutsListByUserId'

export const API: Record<string, string> = {
  CREATE_USER_EXERCISE,
  GET_USER_EXERCISES,
  DELETE_USER_EXERCISE,
  EXERCISES_LIST,
  FINISH_WORKOUT,
  WORKOUTS_LIST,
  START_WORKOUT,
  RESET_WORKOUT,
  GET_CHARTS_DATA,
  DELETE_WORKOUT,
  GLOBAL_STATISTICS,
  CREATE_WORKOUT,
  UPDATE_WORKOUT,
}
