import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const defaultImage = '../../images/product-no-photo.png';

const AutocompleteInput = () => {
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (search.length >= 3) {
        try {
          const { data } = await axios.get(`/api/products/autocomplete?search=${search}`);
          const parsedSuggestions = data.map(suggestion => {
            let images = [];
            if (suggestion.images && typeof suggestion.images === 'string') {
              try {
                images = JSON.parse(suggestion.images);
              } catch (e) {
                console.error('Ошибка при разборе JSON:', e);
              }
            } else {
              images = suggestion.images || [];
            }
            return { ...suggestion, images };
          });
          setSuggestions(parsedSuggestions);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    fetchSuggestions();
  }, [search]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="autocomplete" ref={wrapperRef}>
      <form
        className="autocomplete-search-form"
        onSubmit={(e) => {
          e.preventDefault();
          setShowSuggestions(false);
        }}
      >
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск продуктов"
          className="autocomplete-search-input"
        />
        {/* <button type="submit" className="autocomplete-search-button">
          Поиск
        </button> */}
      </form>

      {showSuggestions && search.length >= 3 && (
        <div className="autocomplete-dropdown">
          {suggestions.length > 0 ? (
            <>
              {suggestions.map(suggestion => (
               <Link
               key={suggestion.med_id}
               to={`/product/${suggestion.med_id}`}
               className="autocomplete-suggestion-item"
               onClick={() => setShowSuggestions(false)}
             >
                  <img
                    src={suggestion.images && suggestion.images.length > 0 ? suggestion.images[0] : defaultImage}
                    alt={suggestion.med_name}
                    className="autocomplete-suggestion-image"
                  />
                  <div className="autocomplete-suggestion-info">
                    <div className="autocomplete-suggestion-name">{suggestion.med_name}</div>
                    <small className="autocomplete-suggestion-price">от {suggestion.price} руб.</small>
                  </div>
                </Link>
              ))}
              <div
                className="autocomplete-view-all-results"
                onClick={() => setShowSuggestions(false)}
              >
                Смотреть все результаты
              </div>
            </>
          ) : (
            <div className="autocomplete-no-results">Нет результатов</div>
          )}
        </div>
      )}
    </div>
  );
};

export default AutocompleteInput;