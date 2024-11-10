interface SourceLinkFormProps {
  url: string;
  setUrl: (url: string) => void;
}

export const SourceLinkForm: React.FC<SourceLinkFormProps> = ({
  url,
  setUrl,
}) => (
  <div className="space-y-4">
    <div>
      <label className="label" htmlFor="source-url">
        Source URL
      </label>
      <input
        id="source-url"
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="input"
        placeholder="https://example.com"
        required
      />
    </div>
    <p className="text-sm text-gray-300 italic">Supports links to web pages</p>
  </div>
);
