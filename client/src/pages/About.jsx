export default function About() {
  return (
    <div className="py-10 max-w-3xl flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-semibold mb-3">About This Project</h1>
        <p className="text-mist">
          Weather Intelligence is a full-stack weather application built as part of the AI
          Engineer Intern technical assessment. It combines a real-time weather API, geocoding,
          maps, and video discovery into a single dashboard.
        </p>
      </div>

      <div className="panel p-6">
        <h2 className="text-lg font-semibold mb-3">What it demonstrates</h2>
        <ul className="list-disc list-inside text-sm text-mist flex flex-col gap-1.5">
          <li>Real-time third-party API integration (weather, geocoding, maps, YouTube)</li>
          <li>RESTful backend architecture with a clear service layer</li>
          <li>Database persistence and full CRUD operations in MongoDB</li>
          <li>Frontend and backend input/date-range validation</li>
          <li>Centralized error handling and graceful degradation</li>
          <li>Data export in JSON and CSV</li>
          <li>Responsive, accessible frontend design</li>
        </ul>
      </div>

      <div className="panel p-6">
        <h2 className="text-lg font-semibold mb-2">Candidate</h2>
        <p className="text-mist">Ayush Tripathi | Full Stack Developer </p>
      </div>

      <div className="panel p-6">
        <h2 className="text-lg font-semibold mb-2">PM Accelerator</h2>
        <p className="text-mist">
          This assessment was completed as part of the PM Accelerator program. Add the program's
          official description here, or link to it, before submitting your assessment.
        </p>
      </div>
    </div>
  )
}
