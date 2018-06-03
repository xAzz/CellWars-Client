export default class Auth {
    static init() {
        $.ajaxSetup({ cache: true });
        $.getScript('//connect.facebook.net/en_US/sdk.js', () => {
            FB.init({appId: '102251620343810', version: 'v2.9'});
            $('#facebook').removeAttr('disabled');
        });

        // is there a jwt token and user
        if (localStorage.token && localStorage.token !== '') {
            // is the token still valid
            let decoded = jwtDecode(localStorage.token);
            if (decoded.exp < +new Date() / 1000) {
                // token is expired
                $('.login').animateCss('zoomInUp');
                $('.login').show();
                $('.profile').hide();
            } else if (decoded.user_name === '') {
                $('.username').animateCss('zoomInUp');
                $('.username').show();
                $('.login').hide();
                $('.profile').hide();
            } else {
                // user is logged in
                let user = JSON.parse(localStorage.user);
                $('.login').hide();
                $('.profile').animateCss('zoomInUp');
                $('.profile').show();
                $('.user').text(`${user.username}#${user.user_id}`);
                $('.email').text(`${user.email}`);
            }
        } else {
            // user is logged out
            $('.login').animateCss('zoomInUp');
            $('.login').show();
            $('.profile').hide();
        }

        $('#facebook').on('click', () => this.fbLogin());
        $('#logout').on('click', () => this.logout());
        $('#continue').on('click', () => this.username());
    }

    static logout() {
        // clear localstorage
        localStorage.token = '';
        localStorage.user = '';
        $('.profile').hide();
        $('.login').animateCss('zoomInUp');
        $('.login').show();
    }

    static username() {
        if ($('#username').val().length > 3) {
            $.post('http://localhost:4000/username', { token: localStorage.token, username: $('#username').val() }).done(data => {
                localStorage.token = data.token;
                localStorage.user = JSON.stringify(data.user);

                $('.user').text(`${data.user.username}#${data.user.id}`);
                $('.email').text(`${data.user.email}`);

                $('.username').hide();
                $('.profile').animateCss('zoomInUp');
                $('.profile').show();
            });
        }
    }

    static fbLogin() {
        FB.login(response => {
            if (response.authResponse) {
                let token = response.authResponse.accessToken;

                // send the fb access token and login
                $.post('http://localhost:4000/auth/facebook', { access_token: token }).done(data => {
                    if (data.emailValid === false) {
                        bootbox.alert('Cell Wars requires the Facebook email permission to be allowed. Please try again.');
                        $('.modal-content').animateCss('zoomInDown');
                        return;
                    }

                    localStorage.setItem('token', data.token);
                    let decoded = jwtDecode(data.token);

                    if (decoded.user_name === '') {
                        $('.username').animateCss('zoomInUp');
                        $('.username').show();
                        $('.username').focus();
                        $('.login').hide();
                        $('.profile').hide();
                    } else {
                        localStorage.setItem('user', JSON.stringify(data.user));
                        $('.user').text(`${data.user.username}#${data.user.user_id}`);
                        $('.email').text(`${data.user.email}`);

                        $('.login').hide();
                        $('.profile').animateCss('zoomInUp');
                        $('.profile').show();

                        Logger.info('User logged in with Facebook');
                    }
                });
            } else {
                Logger.warn('User failed to authorize with Facebook');
            }
        }, {scope: 'email', auth_type: 'rerequest'});

        return false;
    }
}
