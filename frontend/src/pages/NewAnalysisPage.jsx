import React, { useState, useEffect } from 'react';

const NewAnalysisPage = () => {
  const [image, setImage] = useState(null);
  const [gender, setGender] = useState('female');
  const [age, setAge] = useState(25);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    // Reset image preview when component mounts
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      // Create preview URL
      const preview = URL.createObjectURL(file);
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(preview);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!image) {
      setError('Proszę wybrać zdjęcie do analizy');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('gender', gender);
      formData.append('age', age);
      
      const response = await fetch('/analyze', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Wystąpił problem z analizą. Spróbuj ponownie.');
      }
      
      const result = await response.json();
      setAnalysisResult(result);
    } catch (err) {
      setError(err.message || 'Wystąpił błąd podczas analizy');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setImage(null);
    setGender('female');
    setAge(25);
    setAnalysisResult(null);
    setError('');
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 bg-gradient-to-r from-purple-50 to-pink-50 min-h-screen">
      <h1 className="text-3xl font-semibold text-purple-800 mb-6 text-center">Nowa analiza skóry</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-purple-700 mb-2">
                Zdjęcie skóry
              </label>
              <div className="flex flex-col items-center">
                <div className="w-full mb-4 flex justify-center">
                  {imagePreview && (
                    <div className="relative">
                      <img 
                        src={imagePreview} 
                        alt="Podgląd" 
                        className="h-48 w-auto object-cover rounded-lg border border-purple-200" 
                      />
                      <button
                        type="button"
                        onClick={() => {
                          URL.revokeObjectURL(imagePreview);
                          setImagePreview(null);
                          setImage(null);
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
                <label className="flex flex-col items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-lg cursor-pointer hover:bg-purple-200 border-2 border-dashed border-purple-300 w-full md:w-64 transition duration-300">
                  <span className="text-base font-medium mb-1">{imagePreview ? 'Zmień zdjęcie' : 'Wybierz zdjęcie'}</span>
                  <span className="text-xs text-purple-500">JPG, PNG, max 5MB</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-purple-700 mb-2">
                  Płeć
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3 py-2 border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="female">Kobieta</option>
                  <option value="male">Mężczyzna</option>
                  <option value="other">Inna</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-purple-700 mb-2">
                  Wiek
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md">
              {error}
            </div>
          )}
          
          <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
            <button
              type="submit"
              disabled={isLoading || !image}
              className={`px-6 py-2 rounded-md ${
                isLoading || !image
                  ? 'bg-purple-300 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700'
              } text-white font-medium transition duration-300 flex-1`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analizuję...
                </span>
              ) : (
                'Analizuj'
              )}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition duration-300"
            >
              Wyczyść
            </button>
          </div>
        </form>
      </div>
      
      {analysisResult && (
        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-purple-500 animate-fade-in">
          <h2 className="text-2xl font-semibold text-purple-800 mb-4">Wyniki analizy</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-pink-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-pink-700 mb-2">Typ cery</h3>
              <p className="text-2xl font-bold text-pink-800">{analysisResult.skin_type}</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-purple-700 mb-2">Trafność</h3>
              <div className="flex items-center">
                <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-purple-600"
                    style={{ width: `${analysisResult.confidence}%` }}
                  ></div>
                </div>
                <span className="ml-2 font-bold text-purple-800">{analysisResult.confidence}%</span>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-blue-700 mb-2">Porada</h3>
              <p className="text-blue-800">{analysisResult.advice}</p>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <button
              onClick={handleReset}
              className="px-6 py-2 rounded-md bg-purple-600 hover:bg-purple-700 text-white font-medium transition duration-300"
            >
              Nowa analiza
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewAnalysisPage;
