import { render, screen } from '@testing-library/react'
import { StationGroupSelector } from '../../src/components/StationGroupSelector'

test('Given 字母区间分组 When 渲染 Then 展示ABCDE与FGHIJ分组标题', () => {
  render(
    <StationGroupSelector
      onSelectStation={() => {}}
      groups={[
        { name: '热门', stations: ['上海虹桥'] },
        { name: 'ABCDE', stations: ['安庆', '保定'] },
        { name: 'FGHIJ', stations: ['福州'] },
      ]}
    />
  )
  expect(screen.getByText('ABCDE')).toBeInTheDocument()
  expect(screen.getByText('FGHIJ')).toBeInTheDocument()
})

