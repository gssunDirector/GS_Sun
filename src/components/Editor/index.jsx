import React, { useState, useRef, useMemo } from 'react';
import JoditEditor from 'jodit-react';
import { on } from 'events';

 const Editor = ({ value, onChange }) => {
	const editor = useRef(null);
	const [content, setContent] = useState('');

	const config =
		{
			readonly: false, // all options from https://xdsoft.net/jodit/docs/,
			placeholder:  'Start typings...'
		}
	return (
		<JoditEditor
			ref={editor}
			value={value}
			config={config}
			tabIndex={1} // tabIndex of textarea
			onBlur={onChange} // preferred to use only this option to update the content for performance reasons
			// onChange={newContent => setContent(newContent)}
		/>
	);
};

export default Editor;