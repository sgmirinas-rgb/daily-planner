// api/holidays.js
// Vercel 서버리스 함수: 브라우저가 외부 공휴일 API에 직접 접근하면
// CORS에 막힐 수 있어서, 이 함수가 대신 물어봐주고 결과만 돌려줘요.
// 호출 예: /api/holidays?year=2029
export default async function handler(req, res) {
  const year = parseInt(req.query.year, 10);

  if (!year || year < 2000 || year > 2100) {
    res.status(400).json({ error: 'year 파라미터가 올바르지 않아요 (예: ?year=2029)' });
    return;
  }

  try {
    const upstream = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/KR`);
    if (!upstream.ok) {
      res.status(upstream.status).json({ error: '공휴일 정보를 가져오지 못했어요' });
      return;
    }
    const data = await upstream.json();

    // 한 번 가져온 연도는 한 달(30일)간 Vercel 엣지에 캐시해서,
    // 매번 외부 API를 다시 호출하지 않도록 함.
    res.setHeader('Cache-Control', 'public, s-maxage=2592000, stale-while-revalidate=86400');
    res.status(200).json(data);
  } catch (e) {
    res.status(502).json({ error: '공휴일 API 호출 중 오류가 발생했어요' });
  }
}
