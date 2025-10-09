import React from "react";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null; 

  return (
    <div style={{ marginTop: "20px" }}>
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        style={{ margin: "0 10px" }}
      >
        |←
      </button>
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
      >
        ←
      </button>

      <span style={{ margin: "0 10px" }}>
        Page {currentPage} / {totalPages}
      </span>

      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage >= totalPages}
      >
        →
      </button>
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        style={{ margin: "0 10px" }}
      >
        →|
      </button>
    </div>
  );
};

export default Pagination;
