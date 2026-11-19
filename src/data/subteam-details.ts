// Adapted from RECRUITMENT_2026.pdf in the legacy checkout.
// Page references and the mapping from seven legacy departments to the site's
// eight sections are documented in specs/SUBTEAM-CONTENT-SOURCES.md.
interface DetailSection {
  title: string;
  text: string;
  activities?: string[];
}

interface SubteamDetail {
  introduction: string;
  sections: DetailSection[];
}

export const subteamDetails: Record<string, SubteamDetail> = {
  mechanical: {
    introduction: 'Design and manufacture the structures that support the driver and connect the car’s systems, balancing stiffness, mass, accessibility, and safety.',
    sections: [
      {
        title: 'Chassis & composites',
        text: 'The chassis work begins with the structural design of an aluminium monocoque and the distribution of mass throughout the car.',
        activities: [
          'Use CAD and finite element analysis to study the stiffness and weight of aluminium and carbon-fibre components.',
          'Shape and weld chassis structures, manufacture composite components, and investigate composite materials.',
          'Develop the seat and driving position around driver comfort, accessibility, and safety.',
        ],
      },
      {
        title: 'Mechanical drivetrain',
        text: 'Develop the mechanical parts of the prototype motors and custom in-wheel planetary transmission.',
        activities: [
          'Verify structural integrity with FEA and plan manufacturing methods.',
          'Validate the transmission using dedicated experimental test rigs.',
        ],
      },
    ],
  },
  aerodynamics: {
    introduction: 'Develop the aerodynamic package and suspension to turn airflow, tyre contact, and driver inputs into predictable performance on track.',
    sections: [
      {
        title: 'Aerodynamics',
        text: 'Maximise downforce while providing sufficient cooling for the single-seater.',
        activities: [
          'Develop and optimise the front wing, rear wing, and floor.',
          'Study airflow with computational fluid dynamics and validate simulation results through track experiments.',
        ],
      },
      {
        title: 'Suspension, steering & brakes',
        text: 'Study suspension kinematics and steering response, then develop the components and setup that put those targets into practice.',
        activities: [
          'Design and calculate the braking system and verify components through CAE simulations.',
          'Use topology optimisation on uprights and wheel hubs to reduce unsprung mass.',
          'Set up and tune the suspension during testing sessions.',
        ],
      },
    ],
  },
  powertrain: {
    introduction: 'Develop the high-voltage electrical systems that move the car: the energy accumulator, inverters, and electric motors.',
    sections: [
      {
        title: 'Energy storage',
        text: 'Model the electrical and thermal behaviour of the accumulator and develop its mechanical and electrical construction.',
        activities: [
          'Design and construct accumulator segments and battery connections.',
          'Plan high-voltage wiring and the powertrain cooling system.',
        ],
      },
      {
        title: 'Motors & control',
        text: 'Design and construct electric motors, simulate their control systems, and model the complete powertrain.',
        activities: [
          'Integrate systems within Formula Student regulations.',
          'Balance low mass with effective overall vehicle performance.',
        ],
      },
    ],
  },
  electronics: {
    introduction: 'Build the low-voltage systems that connect the car’s subsystems, combining circuit design, embedded software, and electrical construction.',
    sections: [
      {
        title: 'Electronics & embedded software',
        text: 'Design, simulate, and manufacture printed circuit boards, then program the microcontrollers that operate them.',
        activities: [
          'Integrate communications using CAN, MQTT, UART, and SPI.',
          'Manage sensors and actuators across the vehicle.',
        ],
      },
      {
        title: 'Vehicle integration',
        text: 'Bring the electrical system into the car through wiring, interfaces, and mechanical integration.',
        activities: [
          'Design and construct the wiring harness.',
          'Develop driver displays, indicators, controls, and telemetry interfaces.',
          'Use 3D CAD to design printed prototype parts for installation.',
        ],
      },
    ],
  },
  'it-software': {
    introduction: 'Develop the digital infrastructure and applications that support the team’s work and turn vehicle data into useful engineering information.',
    sections: [
      {
        title: 'Infrastructure & applications',
        text: 'Design and maintain the server and cloud environment, alongside custom applications for the team.',
        activities: [
          'Develop real-time telemetry processing and visualisation, Team Radio, and Online Inventory.',
          'Develop and technically manage the official website.',
        ],
      },
      {
        title: 'Data & automation',
        text: 'Build reliable databases for secure storage and fast processing of vehicle and team information.',
        activities: [
          'Provide data pipelines that support analyses throughout the team.',
          'Create automation and AI agent workflows to simplify data processing and complex procedures.',
        ],
      },
    ],
  },
  'vehicle-dynamics': {
    introduction: 'Study the single-seater’s dynamic behaviour and define design targets that connect the work of the entire engineering team.',
    sections: [
      {
        title: 'Track analysis & simulation',
        text: 'Understand the physical forces acting on the car and develop the team’s custom lap-time simulator, combining mathematical analysis with real track data.',
      },
      {
        title: 'Vehicle modelling',
        text: 'Build mathematical models of tyres, suspension, and aerodynamics to inform the setup of the single-seater.',
      },
      {
        title: 'Vehicle control',
        text: 'Design and integrate torque vectoring and traction control to improve vehicle handling and use the available power effectively.',
      },
    ],
  },
  driverless: {
    introduction: 'Combine software, sensors, and machine learning to enable the car to recognise the course and drive it autonomously.',
    sections: [
      {
        title: 'Perception',
        text: 'Detect the cones that define the track and estimate their positions using cameras, LiDAR, neural networks, and mathematical algorithms.',
      },
      {
        title: 'State estimation & SLAM',
        text: 'Estimate the vehicle’s position, speed, and orientation by combining GPS, IMU, and wheel-sensor data with models that account for noise and uncertainty.',
      },
      {
        title: 'Path planning & control',
        text: 'Calculate a trajectory through the course and develop controllers that continuously adjust speed and steering to follow it.',
      },
      {
        title: 'Simulation',
        text: 'Represent the track, car, and sensors in a virtual environment to develop and evaluate perception, localisation, planning, and control before track testing.',
      },
    ],
  },
  operations: {
    introduction: 'Connect the engineering work with partners and the public, securing resources and managing the team’s business and communications activities.',
    sections: [
      {
        title: 'Economic resources & business plan',
        text: 'Find financial and material sponsorships, maintain partner relationships, research markets, and develop the business model and competition pitch.',
      },
      {
        title: 'Film & photography',
        text: 'Capture and edit audiovisual coverage of the team, from everyday workshop life to competition events.',
      },
      {
        title: 'Graphic design & social media',
        text: 'Develop the visual identity, promotional material, and car livery, alongside content strategy and daily interaction with the team’s audience.',
      },
    ],
  },
};
