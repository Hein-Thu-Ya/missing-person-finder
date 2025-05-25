import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Search, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

function Home() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-6">{t('Help Find Missing Persons')}</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
          {t('Join our community effort to reunite families and find missing loved ones. Report missing persons or help in the search.')}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <Link to="/find">
          <Button size="lg" variant="outline" className="w-full sm:w-auto">
            <Search className="mr-2 h-5 w-5" />
            {t('Find Missing Person')}
          </Button>
        </Link>
        <Link to="/add">
          <Button size="lg" className="w-full sm:w-auto">
            <Plus className="mr-2 h-5 w-5" />
            {t('Report Missing Person')}
          </Button>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl"
      >
        <div className="text-center p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">{t('Report')}</h3>
          <p className="text-muted-foreground">
            {t('Quickly submit details about a missing person')}
          </p>
        </div>
        <div className="text-center p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">{t('Search')}</h3>
          <p className="text-muted-foreground">
            {t('Browse and search through missing person reports')}
          </p>
        </div>
        <div className="text-center p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">{t('Connect')}</h3>
          <p className="text-muted-foreground">
            {t('Help reunite families with their loved ones')}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Home;
