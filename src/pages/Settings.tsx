import React, {ChangeEvent, useEffect, useState} from 'react';
import {useStorageState} from "../hooks";

const Settings = () => {
  const [token, setToken] = useState('');
  const [circleCiApiToken, setCircleCiApiToken] = useStorageState("", "CIRCLECI_API_TOKEN");

  useEffect(() => {
    setToken(circleCiApiToken);
  }, [circleCiApiToken]);

  const handleTokenChange = (event: ChangeEvent<HTMLInputElement>) => {
    setToken(event.currentTarget.value);
  }

  const handleSaveApiToken = () => {
    setCircleCiApiToken(token);
  }

  return (
    <form onSubmit={handleSaveApiToken}>
      <label htmlFor="circleCiApiToken">Circle CI API Token</label>
      <input type="text" id="circleCiApiToken" value={token} onChange={handleTokenChange} />
      <button type="submit" onClick={handleSaveApiToken}>Save</button>
    </form>
  );
}

export {Settings}
