import React from 'react'

type Props = {
  currentPage: number
  perPage: number
  totalPages: number
  onPageChange: (p: number) => void
}

export const Pagination: React.FC<Props> = ({ currentPage, perPage, totalPages, onPageChange }) => {
  const canPrev = currentPage > 1
  const canNext = currentPage < totalPages

  const handlePrev = () => {
    if (canPrev) onPageChange(currentPage - 1)
  }

  const handleNext = () => {
    if (canNext) onPageChange(currentPage + 1)
  }

  return (
    <div className="pagination">
      <button className="page-btn" onClick={handlePrev} disabled={!canPrev}>上一页</button>
      <span data-testid="current-page">{currentPage}</span>
      <span data-testid="per-page">{perPage}</span>
      <span data-testid="total-pages">{totalPages}</span>
      <button className="page-btn" onClick={handleNext} disabled={!canNext}>下一页</button>
    </div>
  )
}
