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
  COPY_WORKOUT,
} as const
