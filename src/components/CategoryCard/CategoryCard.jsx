// src/components/CategoryCard/CategoryCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './CategoryCard.css';

// You can use Material-UI icons or any other icon library
// For example with @mui/icons-material:
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SchoolIcon from '@mui/icons-material/School';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import ScienceIcon from '@mui/icons-material/Science';
import ComputerIcon from '@mui/icons-material/Computer';

const CategoryCard = ({ 
  category, 
  title, 
  description, 
  image, 
  productCount, 
  isFeatured = false,
  iconName = 'default',
  linkTo,
  stats = []
}) => {
  
  // Map icon names to actual icons
  const getIcon = (iconName) => {
    const iconMap = {
      'school': <SchoolIcon />,
      'business': <BusinessCenterIcon />,
      'science': <ScienceIcon />,
      'computer': <ComputerIcon />,
      'default': <ArrowForwardIcon />
    };
    return iconMap[iconName] || iconMap.default;
  };

  // Default stats if not provided
  const defaultStats = [
    { value: productCount || '50+', label: 'Products' },
    { value: '4.8', label: 'Rating' },
    { value: '24h', label: 'Delivery' }
  ];

  const displayStats = stats.length > 0 ? stats : defaultStats;

  return (
    <div className="category-card" data-category={category}>
      {isFeatured && <div className="category-badge">Featured</div>}
      
      <div className="category-image-container">
        <img 
          src={image || `https://source.unsplash.com/random/400x300?${category}`} 
          alt={title}
          className="category-image"
          loading="lazy"
        />
        <div className="category-overlay">
          <div className="category-icon">
            {getIcon(iconName)}
          </div>
        </div>
      </div>
      
      <div className="category-content">
        <h3 className="category-title">{title}</h3>
        <p className="category-description">{description}</p>
        
        <div className="category-stats">
          {displayStats.map((stat, index) => (
            <div key={index} className="category-stat">
              <span className="category-stat-value">{stat.value}</span>
              <span className="category-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
        
        <Link 
          to={linkTo || `/category/${category}`} 
          className="category-action-button"
          style={{
            display: 'inline-block',
            padding: '10px 20px',
            backgroundColor: 'transparent',
            color: '#1976d2',
            border: '2px solid #1976d2',
            borderRadius: '4px',
            textDecoration: 'none',
            textAlign: 'center',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#1976d2';
            e.target.style.color = 'white';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = '#1976d2';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          Browse Products →
        </Link>
      </div>
    </div>
  );
};

CategoryCard.propTypes = {
  category: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.string,
  productCount: PropTypes.number,
  isFeatured: PropTypes.bool,
  iconName: PropTypes.oneOf(['school', 'business', 'science', 'computer', 'default']),
  linkTo: PropTypes.string,
  stats: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired
    })
  )
};

CategoryCard.defaultProps = {
  image: '',
  productCount: 0,
  isFeatured: false,
  iconName: 'default',
  stats: []
};

export default CategoryCard;