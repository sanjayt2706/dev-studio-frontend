/**
 * Demo announcement data — centralized and easy to replace.
 * Structure mirrors the eventual MongoDB Announcement document.
 */

const announcementsData = [
  {
    id: 'ann-001',
    title: 'HackStorm 2025 Registrations Open',
    category: 'Event',
    content: 'Registrations for HackStorm 2025 are now live! Form teams of 2-4 and build something incredible in 24 hours. Early bird registration closes October 30th. Visit the events page for more details.',
    image: null,
    publishedAt: '2025-10-01',
    author: 'Arjun Nair',
    featured: true,
    pinned: true,
    active: true,
  },
  {
    id: 'ann-002',
    title: 'New Dev Studio Website Launched',
    category: 'Update',
    content: 'We are thrilled to announce the launch of the brand new Dev Studio website. Built entirely by our members using React, GSAP, and Tailwind CSS, this site represents our commitment to quality craftsmanship.',
    image: null,
    publishedAt: '2025-09-25',
    author: 'Meera Sharma',
    featured: true,
    pinned: false,
    active: true,
  },
  {
    id: 'ann-003',
    title: 'Recruitment Drive — Batch of 2029',
    category: 'Recruitment',
    content: 'First-year students: Dev Studio is looking for passionate developers, designers, and tech enthusiasts. No prior experience required — just curiosity and commitment. Applications open through the Join Us page.',
    image: null,
    publishedAt: '2025-09-15',
    author: 'Sneha Gowda',
    featured: false,
    pinned: false,
    active: true,
  },
  {
    id: 'ann-004',
    title: 'Open Source Contribution Week',
    category: 'Initiative',
    content: 'This week we are running an open source contribution challenge. Members who submit accepted PRs to any public repository earn points on the Dev Studio leaderboard. Top contributors win exclusive merchandise.',
    image: null,
    publishedAt: '2025-09-10',
    author: 'Ishita Reddy',
    featured: false,
    pinned: false,
    active: true,
  },
  {
    id: 'ann-005',
    title: 'Workshop Recordings Now Available',
    category: 'Resources',
    content: 'All recordings from the Cloud Computing 101 and Design Thinking Sprint workshops are now available on our Resources page. Access them anytime to review the material at your own pace.',
    image: null,
    publishedAt: '2025-09-05',
    author: 'Priya Menon',
    featured: false,
    pinned: false,
    active: true,
  },
];

export default announcementsData;
