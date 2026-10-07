import { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import audioManager from './audio/AudioManager';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import InitialLoader from './components/common/InitialLoader';
import CustomCursor from './components/common/CustomCursor';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Team from './pages/Team';
import Projects from './pages/Projects';
import Announcements from './pages/Announcements';
import Events from './pages/Events';
import Resources from './pages/Resources';
import Gallery from './pages/Gallery';
import Join from './pages/Join';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMembers from './pages/admin/AdminMembers';
import AdminProjects from './pages/admin/AdminProjects';
import AdminAnnouncements from './pages/admin/AdminAnnouncements';
import AdminEvents from './pages/admin/AdminEvents';
import AdminResources from './pages/admin/AdminResources';
import AdminGallery from './pages/admin/AdminGallery';
import AdminApplications from './pages/admin/AdminApplications';

gsap.registerPlugin(ScrollTrigger);

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    audioManager.play('page-transition');
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
};

const SmoothScroll = ({ children }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Detect mobile touch devices — use native hardware-accelerated 120Hz/60Hz scrolling for silky smooth mobile performance
    const isTouch = typeof window !== 'undefined' && (
      window.matchMedia('(pointer: coarse)').matches ||
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0
    );

    if (isTouch) {
      // On mobile: native scrolling + standard ScrollTrigger updates (zero lag)
      const onScroll = () => {
        ScrollTrigger.update();
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      gsap.ticker.lagSmoothing(500, 33);

      const refreshTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 200);

      return () => {
        window.removeEventListener('scroll', onScroll);
        clearTimeout(refreshTimer);
      };
    }

    // On desktop: Lenis smooth mousewheel scrolling
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 0, // Disable touch interception
      syncTouch: false,
    });

    window.__lenis = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const tickerCallback = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(500, 33);

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      window.__lenis = null;
      clearTimeout(refreshTimer);
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);
    return () => clearTimeout(t);
  }, [pathname]);

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <InitialLoader />
      <CustomCursor />
      <ScrollToTop />
      <SmoothScroll>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="team" element={<Team />} />
            <Route path="work" element={<Projects />} />
            <Route path="projects" element={<Projects />} />
            <Route path="announcements" element={<Announcements />} />
            <Route path="events" element={<Events />} />
            <Route path="resources" element={<Resources />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="join" element={<Join />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="terms" element={<Terms />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="applications" element={<AdminApplications />} />
            <Route path="members" element={<AdminMembers />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="announcements" element={<AdminAnnouncements />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="resources" element={<AdminResources />} />
            <Route path="gallery" element={<AdminGallery />} />
          </Route>
        </Routes>
      </SmoothScroll>
    </BrowserRouter>
  );
}

export default App;
