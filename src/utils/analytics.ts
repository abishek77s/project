import { BrowsingRecord, DomainStats, TimeStats, DailyStats, CategoryStats, VideoStats} from '../types';
import { categorizeUrl, categorizeVideo } from './categories';

export const getDomainFromUrl = (url: string): string => {
  try {
    const domain = new URL(url).hostname;
    return domain.replace('www.', '');
  } catch {
    return 'invalid-url';
  }
};

const isValidDate = (dateStr: string): boolean => {
  const date = new Date(dateStr);
  return date instanceof Date && !isNaN(date.getTime());
};

const generateYearlyDates = () => {
  const dates = new Map<string, { visits: number; domains: Map<string, number> }>();
  const today = new Date();
  const oneYearAgo = new Date(today);
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
    const dateKey = d.toISOString().split('T')[0];
    dates.set(dateKey, { visits: 0, domains: new Map() });
  }
  return dates;
};

export const analyzeBrowsingHistory = (history: BrowsingRecord[]) => {
  const domainCounts = new Map<string, { visits: number; category: string }>();
  const hourCounts = new Array(24).fill(0);
  const dailyStats = generateYearlyDates();
  const videoStats = new Map<string, number>();
  const mediaStats = {
    movies: new Set<string>(),
    anime: new Set<string>(),
    videos: new Map<string, number>()
  };
  
  history.forEach(record => {
    if (!isValidDate(record.dateTime)) {
      return;
    }

    // Domain analysis
    const domain = getDomainFromUrl(record.navigatedToUrl);
    const category = categorizeUrl(domain);
    const currentCount = domainCounts.get(domain);
    domainCounts.set(domain, {
      visits: (currentCount?.visits || 0) + 1,
      category,
    });
    
    // Time analysis
    const date = new Date(record.dateTime);
    const hour = date.getHours();
    hourCounts[hour]++;

    // Daily analysis
    try {
      const dateKey = date.toISOString().split('T')[0];
      const dayStats = dailyStats.get(dateKey) || { visits: 0, domains: new Map() };
      dayStats.visits++;
      const domainVisits = dayStats.domains.get(domain) || 0;
      dayStats.domains.set(domain, domainVisits + 1);
      dailyStats.set(dateKey, dayStats);

      // Video and media analysis
      if (domain === 'youtube.com' || domain === 'youtu.be') {
        const videoInfo = categorizeVideo(record.pageTitle, record.navigatedToUrl);
        if (videoInfo.category) {
          videoStats.set(
            videoInfo.category,
            (videoStats.get(videoInfo.category) || 0) + 1
          );
        }
        if (videoInfo.title) {
          mediaStats.videos.set(
            videoInfo.title,
            (mediaStats.videos.get(videoInfo.title) || 0) + 1
          );
        }
      } else if (domain.includes('netflix.com') || domain.includes('hulu.com')) {
        if (record.pageTitle.toLowerCase().includes('anime')) {
          mediaStats.anime.add(record.pageTitle);
        } else {
          mediaStats.movies.add(record.pageTitle);
        }
      }
    } catch (error) {
      console.warn('Invalid date format:', record.dateTime);
    }
  });

  // Calculate domain statistics
  const totalVisits = history.length;
  const domainStats: DomainStats[] = Array.from(domainCounts.entries())
    .map(([domain, { visits, category }]) => ({
      domain,
      visits,
      percentage: (visits / totalVisits) * 100,
      category,
    }))
    .sort((a, b) => b.visits - a.visits);

  // Calculate category statistics
  const categoryMap = new Map<string, CategoryStats>();
  domainStats.forEach(stat => {
    const current = categoryMap.get(stat.category) || {
      category: stat.category,
      visits: 0,
      percentage: 0,
      domains: [],
    };
    current.visits += stat.visits;
    current.domains.push(stat);
    categoryMap.set(stat.category, current);
  });

  const categoryStats: CategoryStats[] = Array.from(categoryMap.values())
    .map(stat => ({
      ...stat,
      percentage: (stat.visits / totalVisits) * 100,
    }))
    .sort((a, b) => b.visits - a.visits);

  // Time statistics
  const timeStats: TimeStats[] = hourCounts.map((visits, hour) => ({
    hour,
    visits,
  }));

  // Daily statistics
  const dailyStatsArray: DailyStats[] = Array.from(dailyStats.entries())
    .map(([date, { visits, domains }]) => ({
      date,
      visits,
      topSites: Array.from(domains.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([domain, visits]) => ({ domain, visits })),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Video statistics
  const videoCategories: VideoStats[] = Array.from(videoStats.entries())
    .map(([category, count]) => ({
      category,
      count,
      percentage: (count / videoStats.size) * 100,
    }))
    .sort((a, b) => b.count - a.count);

  // Media statistics
  const topVideos = Array.from(mediaStats.videos.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([title, views]) => ({ title, views }));

  return {
    totalVisits,
    domainStats,
    timeStats,
    dailyStats: dailyStatsArray,
    categoryStats,
    uniqueDomains: domainCounts.size,
    videoCategories,
    mediaStats: {
      movies: Array.from(mediaStats.movies),
      anime: Array.from(mediaStats.anime),
      topVideos,
    },
    mostUsedSocialMedia: domainStats.find(stat => stat.category === 'Social Media'),
  };
};