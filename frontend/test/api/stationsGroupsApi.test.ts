import { getStationGroups } from '../../src/api/stationsGroups'

test('Given 无参数 When 获取站点分组 Then 返回热门与分组列表', async () => {
  const res = await getStationGroups()
  expect(res.groups.find(g => g.name === '热门')).toBeTruthy()
  expect(res.groups.length).toBeGreaterThan(0)
})

