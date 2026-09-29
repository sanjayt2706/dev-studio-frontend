import Hero from '../components/home/Hero';
import OurStory from '../components/home/OurStory';
import SelectedWork from '../components/home/SelectedWork';
import HomeAnnouncements from '../components/home/HomeAnnouncements';
import Stats from '../components/home/Stats';
import OurPeople from '../components/home/OurPeople';
import JoinUs from '../components/home/JoinUs';

const Home = () => {
  return (
    <div className="w-full bg-background overflow-hidden">
      <Hero />
      <OurStory />
      <SelectedWork />
      <HomeAnnouncements />
      <Stats />
      <OurPeople />
      <JoinUs />
    </div>
  );
};

export default Home;
