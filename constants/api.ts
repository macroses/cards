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
const COPY_WORKOUT = '/api/workout/workoutCopy'

const AUTH_SESSION = '/api/auth/session'
const CHECK_ACCESS = '/api/workout/checkAccess'

export const API: Record<string, string> = {
  AUTH_SESSION,
  CHECK_ACCESS,
  COPY_WORKOUT,
  CREATE_USER_EXERCISE,
  CREATE_WORKOUT,
  DELETE_USER_EXERCISE,
  DELETE_WORKOUT,
  EXERCISES_LIST,
  FINISH_WORKOUT,
  GET_CHARTS_DATA,
  GET_USER_EXERCISES,
  GLOBAL_STATISTICS,
  RESET_WORKOUT,
  START_WORKOUT,
  UPDATE_WORKOUT,
  WORKOUTS_LIST,
} as const
