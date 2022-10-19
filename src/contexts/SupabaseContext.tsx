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
import { SupabaseContextType } from 'types/auth';
import { createClient } from '@supabase/supabase-js';
import SbClient from 'server/client/SbClient';
import { trpc } from 'utils/trpc';

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

export const FirebaseProvider = ({ children }: { children: React.ReactElement }) => {
  const [state, dispatch] = useReducer(accountReducer, initialState);
  const registerMutation = trpc.useMutation('auth.register');
  const loginMutation = trpc.useMutation('auth.login');
  const logoutMutation = trpc.useMutation('auth.logout');

  useEffect(
    () =>
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          dispatch({
            type: LOGIN,
            payload: {
              isLoggedIn: true,
              user: {
                id: user.uid,
                email: user.email!,
                name: user.displayName || 'Betty'
              }
            }
          });
        } else {
          dispatch({
            type: LOGOUT
          });
        }
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch]
  );

  const emailPasswordSignIn = async (email: string, password: string) => {
    const output = await loginMutation.mutateAsync({ email, password });
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

  const register = async (email: string, password: string) => registerMutation.mutateAsync({ email, password });

  const logout = () => {
    logoutMutation.mutate();
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
