import OfferCard from "./OfferCard";
...
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {offers.map((offer) => {
              return (
                <OfferCard key={offer.id} offer={offer} />
              );
            })}
          </div>
        )}

        {/* Application Form */}
        <div id="apply-form" className="max-w-2xl mx-auto">
          <div className="bg-background dark:bg-slate-950 rounded-3xl border border-gray-200 dark:border-background/8 p-8 shadow-xl">
            <OfferForm />
          </div>
        </div>
      </div>
    </div>
  );
}
