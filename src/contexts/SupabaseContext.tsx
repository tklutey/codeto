import React, { createContext, useEffect, useReducer } from 'react';

// action - state management
import { LOGIN, LOGOUT } from 'store/actions';
import accountReducer from 'store/accountReducer';

// project imports
import Loader from 'ui-component/Loader';
import { InitialLoginContextProps } from 'types';
import { SupabaseContextType } from 'types/auth';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

// const
const initialState: InitialLoginContextProps = {
  isLoggedIn: false,
  isInitialized: false,
  user: null
};

// ==============================|| SUPABASE CONTEXT & PROVIDER ||============================== //

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
  }, [supabaseClient.auth]);

  const emailPasswordSignIn = async (email: string, password: string) => {
    const output = await supabaseClient.auth.signInWithPassword({ email, password });
    const user = output?.data?.user;
    const error = output?.error;
    if (!error) {
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
    } else {
      throw error;
    }
  };

  const googleSignIn = () => {
    console.error('Not implemented');
    return null;
  };

  const register = async (email: string, password: string) => {
    const output = await supabaseClient.auth.signUp({ email, password });
    const user = output?.data?.user;
    const error = output?.error;
    if (!error) {
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
    }
    throw error;
  };

  const logout = async () => {
    await supabaseClient.auth.signOut();
    dispatch({
      type: LOGOUT
    });
  };

  const resetPassword = async (email: string) => {
    console.error('Not Implemented');
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
