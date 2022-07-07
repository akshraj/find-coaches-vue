let timer;

export default {
  signup(context, payload) {
    return context.dispatch('auth', { ...payload, mode: 'signup' });
  },
  async login(context, payload) {
    return context.dispatch('auth', { ...payload, mode: 'login' });
  },
  logout: function (context) {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('tokenExpiration');

    clearTimeout(timer);

    context.commit('logoutUser');
  },
  async auth(context, payload) {
    const mode = payload.mode;
    let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDyWWFa17CKxdgefYurv_kcRkigdvuFZrc'

    if (mode === 'signup') {
      url = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDyWWFa17CKxdgefYurv_kcRkigdvuFZrc"
    }
    const userData = {
      email: payload.email,
      password: payload.password,
      returnSecureToken: true
    }

    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    const resData = await response.json();
    if (!response.ok) {
      const error = new Error(resData.message || 'Failed to authenticate.');
      throw error;
    }

    const expiresIn = +resData.expiresIn * 1000;
    const expirationDate = new Date().getTime() + expiresIn;

    localStorage.setItem('token', resData.idToken);
    localStorage.setItem('userId', resData.localId);
    localStorage.setItem('tokenExpiration', expirationDate);

    timer = setTimeout(() => {
      context.dispatch('autoLogout')
    }, expiresIn);

    context.commit('setUser', {
      token: resData.idToken,
      userId: resData.localId
    });
  },
  tryLogin(context) {
    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('userId')
    const tokenExpiration = localStorage.getItem('tokenExpiration')

    const expiresIn = +tokenExpiration - new Date().getTime();

    if (expiresIn < 0) {
      return;
    }

    timer = setTimeout(() => {
      context.dispatch('autoLogout')
    }, expiresIn);

    if (token && userId) {
      context.commit('setUser', {
        token,
        userId,
      })
    }
  },
  autoLogout(context) {
    context.dispatch('logout');

    context.commit('setAutoLogout')
  }
}