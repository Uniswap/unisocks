import React, { useState, useEffect } from 'react'

import PlacesAutocomplete, { geocodeByAddress } from 'react-places-autocomplete'
import styled from 'styled-components'

export default function LocationSearchInput({ myRef, inputY, value, setAutoAddress }) {
  const [address, setAddress] = useState('')

  function handleChange(address) {
    setAddress(address)
  }

  // keep acount in sync
  useEffect(() => {
    setAddress(value)
  }, [value])

  function handleSelect(address) {
    geocodeByAddress(address)
      .then(results => {
        setAutoAddress(results[0])
      })
      .catch(error => console.error('Error', error))
  }

  return (
    <PlacesAutocomplete value={address} onChange={handleChange} onSelect={handleSelect}>
      {({ getInputProps, suggestions, getSuggestionItemProps, loading, myRef, inputY, autoComplete }) => (
        <List>
          <input
            required
            ref={myRef}
            autoComplete="off"
            {...getInputProps({
              placeholder: 'Street Address',
              className: 'location-search-input'
            })}
          />
          <SelectForm inputY={inputY}>
            {loading && <div>Loading...</div>}
            {suggestions.map(suggestion => {
              const className = suggestion.active ? 'suggestion-item--active' : 'suggestion-item'
              // inline style for demonstration purpose
              const style = suggestion.active
                ? { backgroundColor: '#dddfe8', cursor: 'pointer', fontWeight: 400, borderRadius: '4px' }
                : { backgroundColor: '#f1f2f6', cursor: 'pointer', fontWeight: 400, borderRadius: '4px' }
              return (
                <div
                  {...getSuggestionItemProps(suggestion, {
                    className,
                    style
                  })}
                >
                  <span>{suggestion.description}</span>
                </div>
              )
            })}
          </SelectForm>
        </List>
      )}
    </PlacesAutocomplete>
  )
}

const List = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-right: 8px;
  min-width: 200px;
`

const SelectForm = styled.div`
  position: absolute;
  top: ${props => props.inputY};
  left: 16px;
  z-index: 10;
  margin-top: 38px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.4);
  border-radius: 8px;
  background-color: #f1f2f6;
  color: #000;

  div {
    padding: 8px;
    /* width: 100%; */
    font-weight: 500;
  }
`
