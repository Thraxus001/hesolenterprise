import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

const DataTable = ({
  columns,
  data,
  loading = false,
  onEdit,
  onDelete,
  onView,
  onExport,
  pagination = true,
  page = 1,
  totalPages = 1,
  onPageChange,
  searchable = false,
  onSearch,
  filters = [],
  onFilterChange,
  actions = true,
  emptyMessage = 'No data found',
  selectable = false,
  onSelectionChange,
  selectedRows = [],
  rowKey = 'id'
}) => {
  const [localSelectedRows, setLocalSelectedRows] = React.useState(selectedRows);
  const [search, setSearch] = React.useState('');

  React.useEffect(() => {
    setLocalSelectedRows(selectedRows);
  }, [selectedRows]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = data.map(item => item[rowKey]);
      setLocalSelectedRows(allIds);
      onSelectionChange && onSelectionChange(allIds);
    } else {
      setLocalSelectedRows([]);
      onSelectionChange && onSelectionChange([]);
    }
  };

  const handleSelectRow = (id) => {
    let newSelection;
    if (localSelectedRows.includes(id)) {
      newSelection = localSelectedRows.filter(rowId => rowId !== id);
    } else {
      newSelection = [...localSelectedRows, id];
    }
    setLocalSelectedRows(newSelection);
    onSelectionChange && onSelectionChange(newSelection);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    onSearch && onSearch(value);
  };

  const handleExportClick = () => {
    if (onExport) {
      if (localSelectedRows.length > 0) {
        onExport(localSelectedRows);
      } else {
        onExport();
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!loading && data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <div className="text-lg">{emptyMessage}</div>
        {search && (
          <button
            onClick={() => {
              setSearch('');
              onSearch && onSearch('');
            }}
            className="mt-4 text-indigo-600 hover:text-indigo-800"
          >
            Clear search
          </button>
        )}
      </div>
    );
  }

  const startItem = (page - 1) * 10 + 1;
  const endItem = Math.min(page * 10, data.length + (page - 1) * 10);
  const totalItems = totalPages * 10;

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      {/* Table Header with Controls */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          {/* Left side: Search and filters */}
          <div className="flex-1">
            {searchable && (
              <div className="relative max-w-xs">
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={handleSearch}
                  className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            )}
            
            {filters.length > 0 && (
              <div className="flex space-x-2 mt-2 md:mt-0">
                {filters.map((filter, index) => (
                  <select
                    key={index}
                    value={filter.value}
                    onChange={(e) => onFilterChange && onFilterChange(filter.key, e.target.value)}
                    className="px-3 py-1 border rounded text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">{filter.label}</option>
                    {filter.options.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ))}
              </div>
            )}
          </div>

          {/* Right side: Actions */}
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            {onExport && (
              <button
                onClick={handleExportClick}
                className="flex items-center space-x-1 px-3 py-2 border rounded-lg hover:bg-gray-50 text-sm"
                title="Export"
              >
                <Download size={16} />
                <span>Export</span>
              </button>
            )}
            
            {selectable && localSelectedRows.length > 0 && (
              <span className="text-sm text-gray-600">
                {localSelectedRows.length} selected
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {selectable && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={data.length > 0 && localSelectedRows.length === data.length}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{ width: column.width }}
                >
                  {column.header}
                </th>
              ))}
              {actions && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, rowIndex) => (
              <tr key={row[rowKey] || rowIndex} className="hover:bg-gray-50">
                {selectable && (
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={localSelectedRows.includes(row[rowKey])}
                      onChange={() => handleSelectRow(row[rowKey])}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                  </td>
                )}
                {columns.map((column) => {
                  const cellData = column.render 
                    ? column.render(row[column.key], row)
                    : row[column.key];
                  
                  return (
                    <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                      {column.type === 'status' ? (
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          cellData === 'active' || cellData === 'completed' ? 'bg-green-100 text-green-800' :
                          cellData === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          cellData === 'inactive' || cellData === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {cellData}
                        </span>
                      ) : column.type === 'badge' ? (
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          column.badgeColors?.[cellData] || 'bg-gray-100 text-gray-800'
                        }`}>
                          {cellData}
                        </span>
                      ) : column.type === 'date' ? (
                        <div className="text-sm text-gray-900">
                          {new Date(cellData).toLocaleDateString()}
                        </div>
                      ) : column.type === 'currency' ? (
                        <div className="text-sm font-medium text-gray-900">
                          ${parseFloat(cellData || 0).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </div>
                      ) : column.type === 'number' ? (
                        <div className="text-sm font-medium text-gray-900">
                          {parseFloat(cellData || 0).toLocaleString()}
                        </div>
                      ) : (
                        <div className={`text-sm ${
                          column.bold ? 'font-medium text-gray-900' : 'text-gray-900'
                        }`}>
                          {cellData}
                        </div>
                      )}
                    </td>
                  );
                })}
                
                {actions && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {onView && (
                        <button
                          onClick={() => onView(row)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View"
                        >
                          <Eye size={18} />
                        </button>
                      )}
                      {onEdit && (
                        <button
                          onClick={() => onEdit(row)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(row)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{startItem}</span> to{' '}
              <span className="font-medium">{endItem}</span> of{' '}
              <span className="font-medium">{totalItems}</span> results
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onPageChange && onPageChange(1)}
                disabled={page === 1}
                className={`p-2 rounded ${
                  page === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <ChevronsLeft size={18} />
              </button>
              <button
                onClick={() => onPageChange && onPageChange(page - 1)}
                disabled={page === 1}
                className={`p-2 rounded ${
                  page === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <ChevronLeft size={18} />
              </button>
              
              {/* Page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange && onPageChange(pageNum)}
                    className={`px-3 py-1 rounded ${
                      page === pageNum
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => onPageChange && onPageChange(page + 1)}
                disabled={page === totalPages}
                className={`p-2 rounded ${
                  page === totalPages
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <ChevronRight size={18} />
              </button>
              <button
                onClick={() => onPageChange && onPageChange(totalPages)}
                disabled={page === totalPages}
                className={`p-2 rounded ${
                  page === totalPages
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <ChevronsRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;