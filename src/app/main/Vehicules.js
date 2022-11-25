import { useGetVehiculesQuery } from '../store/internalApi/vehicules';

const Vehicules = () => {
  const getVehiculesQuery = { useGetVehiculesQuery };

  return (
    <div>
      {getVehiculesQuery.isSuccess &&
        getVehiculesQuery.data.map((vehicule) => {
          return (
            <div className="flex">
              <div>{vehicule.marque}</div>
              <div>{vehicule.modele}</div>
              <div>{vehicule.kilometrage}</div>
              <div>{vehicule.prix_journalier}</div>
            </div>
          );
        })}
    </div>
  );
};

export default Vehicules;
