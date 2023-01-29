import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const __getTodos = createAsyncThunk(
  // createAsyncThunk는 2개의 인자를 받음
  "GET_TODOS", // 인자 1. action type에 대한 prefix이다.

  async (arg, thunkAPI) => {
    //인자2. DB를 입력하는 과정이 들어있는 로직,
    try {
      const todos = await axios.get("http://localhost:4000/todos"); // 여기가 핵심, get을 통해서 해당 url에 있는 todos의 자료를 가지고옴
      // await를 붙인 이유는 비동기를 동기처럼 사용하기 위해, 즉 다시 말해서 await가 있어야지 순서대로 내려감, 만약 await를 사용하지 않으면 axios.get아래 코드가 먼저 실행된 뒤에 실행 될 수 있음
      return thunkAPI.fulfillWithValue(todos.data);
      // 이행이 됐을 때 넘겨주는 데이터, todos라는 url에서 data를 가져옴
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

export const __addTodoThunk = createAsyncThunk(
  "ADD_TODO",
  async (arg, thunkAPI) => {
    try {
      const response = await axios.post("http://localhost:4000/todos", arg);
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      console.log(err);
      return thunkAPI.rejectWithValue(err);
    }
  }
);

export const __removeTodoThunk = createAsyncThunk(
  "REMOVE_TODO",
  async (arg, thunkAPI) => {
    try {
      await axios.delete(`http://localhost:4000/todos/${arg}`);
      return thunkAPI.fulfillWithValue(arg);
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

export const __switchTodoThunk = createAsyncThunk(
  "SWITCH_TODO",
  async (arg, thunkAPI) => {
    try {
      await axios.update(`http://localhost:4000/todos/${arg.id}`, arg);
      return thunkAPI.fulfillWithValue(arg);
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

const initialState = {
  todos: [],
  isSuccess: false,
  isLoading: false,
  error: null,
};

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    // addTodo: (state, action) => {
    //   return [...state, action.payload];
    // }, // action creator의 이름
    // removeTodo: (state, action) => {
    //   return state.filter((item) => item.id !== action.payload);
    // }, // action creator의 이름
    // switchTodo: (state, action) => {
    //   return state.map((item) => {
    //     if (item.id === action.payload) {
    //       return { ...item, isDone: !item.isDone };
    //     } else {
    //       return item;
    //     }
    //   });
    // }, // action creator의 이름
  },
  extraReducers: {
    // get
    [__getTodos.fulfilled]: (state, action) => {
      state.todos = action.payload;
    },

    [__getTodos.rejected]: (state, action) => {
      state.error = action.payload;
    },

    // add
    [__addTodoThunk.fulfilled]: (state, action) => {
      state.todos = [...state.todos, action.payload];
    },

    [__addTodoThunk.rejected]: (state, action) => {
      state.error = action.payload;
    },
    //delete
    [__removeTodoThunk.fulfilled]: (state, action) => {
      state.todos = state.todos.filter((item) => item.id !== action.payload);
    },

    [__removeTodoThunk.rejected]: (state, action) => {
      state.error = action.payload;
    },
    // switch
    [__switchTodoThunk.fulfilled]: (state, action) => {
      state.todos = state.todos.map((t) => {
        if (t.id === action.payload.id) {
          return { ...t, isDone: !t.isDone };
        } else {
          return t;
        }
      });
    },

    [__switchTodoThunk.rejected]: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { removeTodo, switchTodo } = todosSlice.actions;
export default todosSlice.reducer;
