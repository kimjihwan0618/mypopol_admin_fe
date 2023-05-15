import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from 'app/store/userSlice';
import Gravatar from 'react-gravatar';
import settingsConfig from 'app/configs/settingsConfig';
import jwtService from 'app/auth/services/jwtService/index';

function Header({ menuBarStatus, menuBarToggle }) {
  const user = useSelector(selectUser);
  const menuHideClick = () => {
    menuBarToggle('active');
  };

  const fullScreenToggle = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };
  return (
    <header>
      <div className="header__inner">
        {/* <!-- left --> */}
        <div className="left">
          <div className="wrap">
            <div>
              {/* <!-- 메뉴 토글 --> */}
              <button
                id="menuOn"
                onClick={menuHideClick}
                className={menuBarStatus === 'hide' ? 'icon__link' : 'icon__link hide'}
              >
                <div>
                  <svg viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 10h16M4 14h16M4 18h16"
                    />
                  </svg>
                </div>
              </button>
              {/* <!-- // 메뉴 토글 --> */}
              {/* <!-- 캘린더 --> */}
              {/* <a href="app/theme-layouts/MainLayout/components/index#" className="icon__link hide">
                <div>
                  <svg viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </a> */}
              {/* <!-- // 캘린더 --> */}
              {/* <!-- 이메일 --> */}
              <a href="#" className="icon__link hide">
                <div>
                  <svg viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </a>
              {/* <!-- // 이메일 --> */}
              {/* <!-- 이메일 --> */}
              <a href="#" className="icon__link hide">
                <div>
                  <svg viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
              </a>
              {/* <!-- // 이메일 --> */}
            </div>
          </div>
        </div>
        {/* <!-- // left --> */}
        {/* <!-- right --> */}
        <div className="right">
          {/* <!-- 언어 --> */}
          {/* <div className="icon lang">
            <label className="selector__label" htmlFor="language">
              <input type="text" id="language" />
              <ul>
                <li className="list">
                  <a href="app/theme-layouts/MainLayout/components/index#">
                    <span className="icon">
                      <img
                        src={`${process.env.PUBLIC_URL}/images/icon/language/us.svg`}
                        alt="국기"
                      />
                    </span>
                    <p>EN</p>
                  </a>
                </li>
              </ul>
              <img src={`${process.env.PUBLIC_URL}/images/icon/language/kr.svg`} alt="국기" />
              <p className="f__medium">KR</p>
            </label>
          </div> */}
          {/* <!-- // 언어 --> */}
          {/* <!-- 풀스크린 --> */}
          <div className="icon" onClick={fullScreenToggle}>
            <svg viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
              />
            </svg>
          </div>
          {/* <!-- // 풀스크린 --> */}
          {/* <!-- 알림 --> */}
          {/* <div className="icon on" id="bell">
            <svg viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </div> */}
          {/* <!-- // 알림 --> */}
          {/* <!-- 프로필 --> */}
          <div className="icon profile">
            <label className="selector__label" htmlFor="profile">
              <input type="text" id="profile" />
              <ul>
                <li className="list">
                  <NavLink to="apps/user">
                    <span className="icon">
                      <svg viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </span>
                    <p className="f__medium">프로필</p>
                  </NavLink>
                </li>
                <li className="list">
                  <a href="#" onClick={(e) => jwtService.logout()}>
                    <span className="icon">
                      <svg viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                    </span>
                    <p className="f__medium">로그아웃</p>
                  </a>
                </li>
              </ul>
              <div className="profile__wrap">
                <dl>
                  <dt className="name f__medium">{user.username}</dt>
                  <dd className="role f__medium">{user.role}</dd>
                </dl>
                <div className="user__img">
                  <img src={require('assets/img/profile.jpg')} alt="프로필 이미지" />
                </div>
              </div>
            </label>
          </div>
          {/* <!-- // 프로필 --> */}
        </div>
        {/* <!-- // right --> */}
      </div>
    </header>
  );
}

export default Header;
