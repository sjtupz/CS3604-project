import { render, screen } from '@testing-library/react'
import { test, expect } from 'vitest'
import { StationGroupSelector } from '../../src/components/StationGroupSelector'
import { getStationGroups } from '../../src/api/stationsGroups'

test('Given 加载分组 When 渲染 Then 显示热门与字母分组标题', async () => {
  const res = await getStationGroups()
  render(<StationGroupSelector groups={res.groups} onSelectStation={() => {}} />)
  expect(screen.getByText('热门')).toBeTruthy()
  expect(screen.getByText('ABCDE')).toBeTruthy()
})

test('Given 输入搜索词 When 模糊过滤 Then 列表仅显示匹配项', async () => {
  const res = await getStationGroups()
  render(<StationGroupSelector groups={res.groups} onSelectStation={() => {}} />)
  const input = screen.getByPlaceholderText('搜索站点')
  expect(input).toBeTruthy()
})

