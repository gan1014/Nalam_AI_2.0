export function generateForecastData(disease: string) {
  const baseValues: Record<string, number> = {
    dengue: 185, scrub_typhus: 78, gastroenteritis: 234,
    heat_stroke: 42, respiratory: 312
  };
  const base = baseValues[disease] || 150;
  return Array.from({ length: 14 }, (_, i) => {
    const trend = 1 + i * 0.07 + Math.sin(i * 0.6) * 0.18;
    const median = Math.round(base * trend);
    return {
      day: `Day ${i + 1}`,
      date: new Date(Date.now() + (i+1) * 86400000)
             .toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      p05: Math.round(median * 0.58),
      p50: median,
      p95: Math.round(median * 1.58),
      threshold: Math.round(base * 1.85),
    };
  });
}

export const leadTimeTimelineData = [
  {week:'W36',actual:12,idsp:null,nalamp:8,arima:null},
  {week:'W37',actual:15,idsp:null,nalamp:11,arima:null},
  {week:'W38',actual:19,idsp:null,nalamp:16,arima:null},
  {week:'W39',actual:28,idsp:null,nalamp:28,arima:null},
  {week:'W40',actual:45,idsp:null,nalamp:48,arima:null},
  {week:'W41',actual:92,idsp:null,nalamp:72,arima:null},
  {week:'W42',actual:178,idsp:null,nalamp:95,arima:null},
  {week:'W43',actual:312,idsp:12,nalamp:98,arima:null},
  {week:'W44',actual:487,idsp:15,nalamp:96,arima:null},
  {week:'W45',actual:521,idsp:28,nalamp:94,arima:98},
  {week:'W46',actual:489,idsp:45,nalamp:91,arima:145},
  {week:'W47',actual:398,idsp:92,nalamp:85,arima:287},
  {week:'W48',actual:287,idsp:178,nalamp:71,arima:312},
  {week:'W49',actual:201,idsp:312,nalamp:55,arima:198},
  {week:'W50',actual:134,idsp:487,nalamp:42,arima:134},
];
