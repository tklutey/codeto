import { dispatch, useSelector } from 'store';
import { useEffect } from 'react';
import { openDrawer } from 'store/slices/menu';

export default function useOpenNavDrawer() {
  const { drawerOpen } = useSelector((state) => state.menu);
  useEffect(() => {
    if (drawerOpen) {
      dispatch(openDrawer(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
