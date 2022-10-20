import React, { createContext, useEffect, useReducer } from 'react';

// third-party
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

// action - state management
import { LOGIN, LOGOUT } from 'store/actions';
import accountReducer from 'store/accountReducer';

// project imports
import Loader from 'ui-component/Loader';
import { FIREBASE_API } from 'config';
import { InitialLoginContextProps } from 'types';
import { JWTData, SupabaseContextType } from 'types/auth';
import { createClient } from '@supabase/supabase-js';
import SbClient from 'server/client/SbClient';
import { trpc } from 'utils/trpc';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import jwt from 'jsonwebtoken';

// firebase initialize
if (!firebase.apps.length) {
  firebase.initializeApp(FIREBASE_API);
}

// const
const initialState: InitialLoginContextProps = {
  isLoggedIn: false,
  isInitialized: false,
  user: null
};

// ==============================|| FIREBASE CONTEXT & PROVIDER ||============================== //

const SupabaseContext = createContext<SupabaseContextType | null>(null);

export const SupabaseProvider = ({ children }: { children: React.ReactElement }) => {
  const [state, dispatch] = useReducer(accountReducer, initialState);
  const supabaseClient = useSupabaseClient();

  useEffect(() => {
    const init = async () => {
      try {
        const session = await supabaseClient.auth.getSession();
        const user = session?.data.session?.user;
        if (user) {
          dispatch({
            type: LOGIN,
            payload: {
              isLoggedIn: true,
              user: {
                email: user.email,
                id: user.id
              }
            }
          });
        } else {
          dispatch({
            type: LOGOUT
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: LOGOUT
        });
      }
    };
    init();
  }, []);

  const emailPasswordSignIn = async (email: string, password: string) => {
    const output = await supabaseClient.auth.signInWithPassword({ email, password });
    const user = output?.data?.user;
    if (user) {
      dispatch({
        type: LOGIN,
        payload: {
          isLoggedIn: true,
          user
        }
      });
    }
    return output;
  };

  const googleSignIn = () => {
    const provider = new firebase.auth.GoogleAuthProvider();

    return firebase.auth().signInWithPopup(provider);
  };

  const register = async (email: string, password: string) => {
    const output = await supabaseClient.auth.signUp({ email, password });
    const user = output?.data?.user;
    if (user) {
      dispatch({
        type: LOGIN,
        payload: {
          isLoggedIn: true,
          user
        }
      });
    }
    return output;
  };

  const logout = async () => {
    await supabaseClient.auth.signOut();
    dispatch({
      type: LOGOUT
    });
  };

  const resetPassword = async (email: string) => {
    await firebase.auth().sendPasswordResetEmail(email);
  };

  const updateProfile = () => {};
  if (state.isInitialized !== undefined && !state.isInitialized) {
    return <Loader />;
  }

  return (
    <SupabaseContext.Provider
      value={{
        ...state,
        register,
        emailPasswordSignIn,
        login: () => {},
        googleSignIn,
        logout,
        resetPassword,
        updateProfile
      }}
    >
      {children}
    </SupabaseContext.Provider>
  );
};

export default SupabaseContext;
