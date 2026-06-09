import PropTypes from 'prop-types';
// import sidebarData from './SidebarData';
import withRouter from '@/components/Common/withRouter';
import { Link } from 'react-router-dom';
//i18n
import { withTranslation } from 'react-i18next';
import Sider from 'antd/es/layout/Sider';
import { Layout, Menu } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { useDispatch, useSelector } from 'react-redux';
import logoSm from '../../assets/images/faro-sm.png';
import logoDark from '../../assets/images/faro-dark.png';
import logoLight from '../../assets/images/faro-light.png';
import ProfileMenu from '@/components/Common/TopbarDropdown/ProfileMenu';
import { getCollapsedSideMenu } from '../../store/selectors/layout';
import { setCollapsedSideMenu } from '../../store/slices/layout';
import './Sidebar.scss';
import { sidebarRoutes } from '@/constants/sidebarRoutes';

const Sidebar = (props) => {
  const { content } = props;

  const collapsedSideMenu = useSelector(getCollapsedSideMenu);

  const dispatch = useDispatch();

  // Function to generate menu items in the new format
  const generateMenuItems = () => {
    const items = [];

    (sidebarRoutes || []).forEach((row, index) => {
      // console.log('Sidebar row:', row);
      if (row.isMainMenu) {
        // Main menu headers - these are dividers/separators, not clickable items
        items.push({
          key: `header-${index}`,
          type: 'divider',
          style: {
            margin: '8px 0',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }
        });

        // Add a group label after the divider
        items.push({
          key: `group-${index}`,
          type: 'group',
          label: collapsedSideMenu ? '•' : row.label,
          style: {
            padding: collapsedSideMenu ? '4px 0' : '8px 16px',
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            color: 'rgba(255, 255, 255, 0.6)',
            textAlign: collapsedSideMenu ? 'center' : 'left'
          }
        });
      } else if (row.subItem && row.subItem.length > 0) {
        // Submenu items
        items.push({
          key: `sub-${index}`,
          icon: <i className={row.icon} style={{ marginRight: '5px' }} />,
          label: row.url ? <Link to={row.url}>{row.label}</Link> : row.label,
          children: row.subItem.map((subRow, j) => ({
            key: `item-${index}-${j}`,
            label: <Link to={subRow.link}>{subRow.sublabel}</Link>
          }))
        });
      } else {
        items.push({
          key: `item-${index}`,
          icon: <i className={row.icon} />,
          label: <Link to={row.url}>{row.label}</Link>
        });
      }
    });

    return items;
  };

  const toggleFullscreen = () => {
    const doc: any = document;
    const docEl: any = document.documentElement;

    if (
      !doc.fullscreenElement &&
      /* alternative standard method */ !doc.mozFullScreenElement &&
      !doc.webkitFullscreenElement
    ) {
      // current working methods
      if (docEl.requestFullscreen) {
        docEl.requestFullscreen();
      } else if (docEl.mozRequestFullScreen) {
        docEl.mozRequestFullScreen();
      } else if (docEl.webkitRequestFullscreen) {
        // we ignore type issues on ALLOW_KEYBOARD_INPUT
        docEl.webkitRequestFullscreen((Element as any).ALLOW_KEYBOARD_INPUT);
      }
    } else {
      if (doc.cancelFullScreen) {
        doc.cancelFullScreen();
      } else if (doc.mozCancelFullScreen) {
        doc.mozCancelFullScreen();
      } else if (doc.webkitCancelFullScreen) {
        doc.webkitCancelFullScreen();
      }
    }
  };

  const tToggle = () => {
    var body = document.body;
    if (window.screen.width <= 998) {
      body.classList.toggle('sidebar-enable');
    } else {
      body.classList.toggle('vertical-collpsed');
      body.classList.toggle('sidebar-enable');
    }
    dispatch(setCollapsedSideMenu(!collapsedSideMenu));
    // implementar el dispatch aqui para hacer el collapse del side menu
  };

  const siderStyle: React.CSSProperties = {
    overflow: 'auto',
    height: '100vh',
    position: 'sticky' as const,
    insetInlineStart: 0,
    top: 0,
    bottom: 0,
    scrollbarWidth: 'thin',
    scrollbarGutter: 'stable',
    background: '#1b2c3f'
  };

  return (
    <Layout>
      <Sider
        className="main-sidebar"
        style={siderStyle}
        width={250}
        collapsible
        collapsed={collapsedSideMenu}
        trigger={null}
      >
        <div className="navbar-brand-box text-center">
          <Link to="/" className="logo logo-dark">
            <span className="logo-sm">
              <img src={logoSm} alt="logo-sm-dark" height="22" />
            </span>
            <span className="logo-lg">
              <img src={logoDark} alt="logo-dark" height="24" />
            </span>
          </Link>

          <Link to="/" className="logo logo-light">
            <span className="logo-sm">
              <img src={logoSm} alt="logo-sm-light" height="22" />
            </span>
            <span className="logo-lg">
              <img src={logoLight} alt="logo-light" height="24" />
            </span>
          </Link>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          style={{ height: 'calc(100% - 80px)', borderRight: 0, background: 'transparent' }}
          items={generateMenuItems()}
        />
      </Sider>
      <Layout style={{ padding: '0 24px 24px' }}>
        <div className="navbar-header">
          <button
            type="button"
            className="btn btn-sm px-3 font-size-24 header-item waves-effect"
            id="vertical-menu-btn"
            onClick={() => {
              tToggle();
            }}
          >
            <i className="ri-menu-2-line align-middle"></i>
          </button>
          <div className="d-flex">
            <div className="dropdown d-none d-lg-inline-block ms-1">
              <button
                type="button"
                onClick={() => {
                  toggleFullscreen();
                }}
                className="btn header-item noti-icon"
                data-toggle="fullscreen"
              >
                <i className="ri-fullscreen-line" />
              </button>
            </div>
            <ProfileMenu />
          </div>
        </div>
        <Content
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
            overflow: 'hidden'
          }}
        >
          {content}
        </Content>
      </Layout>
    </Layout>
  );
};
Sidebar.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any
};
export default withRouter(withTranslation()(Sidebar));
